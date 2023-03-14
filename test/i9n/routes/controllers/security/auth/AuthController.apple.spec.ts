import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import { UsernameUtility } from '../../../../../../src/iviche/common/UsernameUtility'
import {
  ConflictErrorCodes,
  ForbiddenErrorCodes,
} from '../../../../../../src/iviche/error/DetailErrorCodes'
import { AppleData } from '../../../../../../src/iviche/security/auth/models/AppleData'
import { AuthProvider } from '../../../../../../src/iviche/security/auth/services/AuthProvider'
import { personsList } from '../../../../../database/seeds/01_InitialData'
import {
  socialProfilesSeed,
  userDetailsList,
} from '../../../../../database/seeds/TestSocialProfileList'
import { primeAdminData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'
import { expectCorrectTokens } from './authHelper'

import SpyInstance = jest.SpyInstance
describe('AuthController. Facebook', () => {
  let authService: AuthProvider
  let spy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([socialProfilesSeed])

    authService = container.resolve('AuthProvider')
    spy = jest.spyOn(authService, 'decodeAppleToken')
    done()
  })

  test('Login via apple with correct token. Basic data profile. Login to an existing account', async () => {
    // GIVEN full data apple profile
    const AppleFullProfileData: AppleData = {
      id: userDetailsList[0].appleId as string,
      email: 'test.apple@iviche.com',
      emailVerified: true,
    }
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    // AND mock nonce check request to apple services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(AppleFullProfileData)
    })
    const correctToken = 'correctAppleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/apple
    const response = await request(TestContext.app)
      .post('/auth/login/apple')
      .send({ token: correctToken })
      .set('User-Agent', testUserAgent)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND url for the request, must contain the following params
    expect(spy).toHaveBeenCalledWith(correctToken)
    // AND contain auth tokens
    expectCorrectTokens(response)
    // AND contain isNew field
    expect(response.body.isNew).toBeFalsy()
  })

  test('Login via apple with correct token. Registration', async () => {
    // GIVEN basic data apple profile
    const AppleBasicProfileData: AppleData = {
      id: 'new.user.apple.id',
      email: 'testovich.apple@iviche.com',
      emailVerified: true,
    }
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    // AND mock nonce check request to apple services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(AppleBasicProfileData)
    })
    // AND correct user token
    const correctToken = 'correctAppleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/apple
    const response = await request(TestContext.app)
      .post('/auth/login/apple')
      .send({ token: correctToken, userData: { familyName: 'Family', givenName: 'Given ' } })
      .set('User-Agent', testUserAgent)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND url for the request, must contain the following params
    expect(spy).toHaveBeenCalledWith(correctToken)
    // AND contain auth tokens
    expectCorrectTokens(response)
    // AND contain isNew field
    expect(response.body.isNew).toBeTruthy()
    // AND check if a profile with expected username has been created
    const expectedUsername = UsernameUtility.createAppleUsername(AppleBasicProfileData.id)
    const check = await request(TestContext.app)
      .get(`/user-profile/profiles/${AppleBasicProfileData.email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.status).toBe(200)
    expect(check.body.user.username).toBe(expectedUsername)
    expect(check.body.person.email).toBe(AppleBasicProfileData.email)

    // AND check on email username is not created
    const errorCheck = await request(TestContext.app)
      .get(`/user-profile/profiles/${expectedUsername}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(errorCheck.status).toBe(404)
    expect(errorCheck.body).toStrictEqual({
      code: 404002,
      message: 'User profile with the specified email cannot be found',
      source: 'profile',
    })
  })

  test('Login via facebook with correct token. Fail. Apple profile with unverified email', async () => {
    // GIVEN basic data facebook profile without email
    const AppleBasicProfileData: AppleData = {
      id: 'new.user.apple.id',
      email: 'test.apple.email@iviche.com',
      emailVerified: false,
    }
    // AND mock nonce check request to apple services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(AppleBasicProfileData)
    })
    const correctToken = 'correctAppleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/apple
    const response = await request(TestContext.app)
      .post('/auth/login/apple')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: "Apple's email is not verified",
      code: ForbiddenErrorCodes.EMAIL_IS_NOT_CONFIRMED,
      source: 'apple',
    })
  })
  test('Registration via apple with correct token. Fail. Email is already exist.', async () => {
    // GIVEN basic data facebook profile
    const AppleBasicProfileData: AppleData = {
      id: '0111111111111111',
      email: personsList[11].email,
      emailVerified: true,
    }
    // AND mock get request to fb services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(AppleBasicProfileData)
    })
    const correctToken = 'correctAppleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/apple
    const response = await request(TestContext.app)
      .post('/auth/login/apple')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({
      message: `User with email ${personsList[11].email} already exists`,
      code: ConflictErrorCodes.EXIST_ERROR,
      source: 'apple',
    })
  })

  afterEach(async done => {
    spy.mockClear()
    done()
  })

  afterAll(async done => {
    await TestContext.close()
    spy.mockRestore()
    done()
  })
})
