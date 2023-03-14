import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import { UsernameUtility } from '../../../../../../src/iviche/common/UsernameUtility'
import {
  ConflictErrorCodes,
  ForbiddenErrorCodes,
} from '../../../../../../src/iviche/error/DetailErrorCodes'
import { FacebookData } from '../../../../../../src/iviche/security/auth/models/FacebookData'
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
    spy = jest.spyOn(authService, 'decodeFacebookToken')
    done()
  })

  test('Login via facebook with correct token. Full data profile. Login to an existing account', async () => {
    // GIVEN full data facebook profile
    const FBFullProfileData: FacebookData = {
      id: userDetailsList[0].facebookId as string,
      email: 'test1@iviche.com',
      birthday: '01/01/2000',
      location: {
        id: '111649395528170',
        name: 'Харьков',
      },
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
      gender: 'male',
    }
    // AND mock get request to fb services (full data profile)
    spy.mockImplementationOnce(() => {
      return Promise.resolve(FBFullProfileData)
    })
    const correctToken = 'correctFacebookAuthTokenForAuth'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN login POST is sent to /auth/login/facebook
    const response = await request(TestContext.app)
      .post('/auth/login/facebook')
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

  test('Login via facebook with correct token. Basic profile data. Login to an existing account.', async () => {
    // GIVEN basic data facebook profile
    const FBBasicProfileData: FacebookData = {
      id: userDetailsList[0].facebookId as string,
      email: 'testFacebook@iviche.com',
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services (basic data profile: id,email,first_name,last_name)
    spy.mockImplementationOnce(() => {
      return Promise.resolve(FBBasicProfileData)
    })
    // AND correct user token
    const correctToken = 'correctFacebookAuthTokenForAuth'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN login POST is sent to /auth/login/facebook
    const response = await request(TestContext.app)
      .post('/auth/login/facebook')
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

  test('Login via facebook with correct token. Registration. Basic profile data', async () => {
    // GIVEN basic data facebook profile
    const FBBasicProfileData: FacebookData = {
      id: '0000000000000003',
      email: 'test3@iviche.com',
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services (basic data profile: id,first_name,last_name and email)
    spy.mockImplementationOnce(() => {
      return Promise.resolve(FBBasicProfileData)
    })
    // AND correct user token
    const correctToken = 'correctFacebookAuthTokenForAuth'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN login POST is sent to /auth/login/facebook
    const response = await request(TestContext.app)
      .post('/auth/login/facebook')
      .send({ token: correctToken })
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
    const expectedUsername = UsernameUtility.createFacebookUsername(FBBasicProfileData.id)
    const check = await request(TestContext.app)
      .get(`/user-profile/profiles/${FBBasicProfileData.email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.status).toBe(200)
    expect(check.body.user.username).toBe(expectedUsername)
    expect(check.body.person.email).toBe(FBBasicProfileData.email)

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

  test('Login via facebook with correct token. Fail. Facebook profile without email', async () => {
    // GIVEN basic data facebook profile without email
    const FBBasicProfileData: FacebookData = {
      id: '11111111111111111',
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services (full data profile)
    spy.mockImplementationOnce(() => {
      return Promise.resolve(FBBasicProfileData)
    })
    const correctToken = 'correctFacebookAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/facebook
    const response = await request(TestContext.app)
      .post('/auth/login/facebook')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: "Facebook's email is empty",
      code: ForbiddenErrorCodes.NO_EMAIL_ON_FACEBOOK,
      source: 'facebook',
    })
  })
  test('Registration via facebook with correct token. Fail. Email is already exist.', async () => {
    // GIVEN basic data facebook profile
    const FBBasicProfileData: FacebookData = {
      id: '0111111111111111',
      email: personsList[11].email,
      first_name: 'Im already', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Existovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(FBBasicProfileData)
    })
    const correctToken = 'correctFacebookAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/facebook
    const response = await request(TestContext.app)
      .post('/auth/login/facebook')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({
      message: `User with email ${personsList[11].email} already exists`,
      code: ConflictErrorCodes.EXIST_ERROR,
      source: 'facebook',
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
