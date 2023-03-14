import 'reflect-metadata'

import request from 'supertest'

import {
  socialProfilesSeed,
  userDetailsList,
  usersList,
} from '../../../../../database/seeds/TestSocialProfileList'
import { TestContext } from '../../../../context/TestContext'
import { expectCorrectTokens } from './authHelper'

import SpyInstance = jest.SpyInstance
import { container } from 'tsyringe'

import {
  ConflictErrorCodes,
  ForbiddenErrorCodes,
} from '../../../../../../src/iviche/error/DetailErrorCodes'
import { AuthProvider } from '../../../../../../src/iviche/security/auth/services/AuthProvider'
import Knex = require('knex')

import { UsernameUtility } from '../../../../../../src/iviche/common/UsernameUtility'
import { AuthData } from '../../../../../../src/iviche/security/auth/models/AuthData'
import { User } from '../../../../../../src/iviche/users/models/User'
import { personsList } from '../../../../../database/seeds/01_InitialData'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('AuthController. Google', () => {
  let authService: AuthProvider
  let spy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([socialProfilesSeed])

    authService = container.resolve('AuthProvider')
    spy = jest.spyOn(authService, 'decodeGoogleToken')
    done()
  })

  beforeEach(() => {
    // NOTE: for future tests with nodemailer
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('Registration via google with correct token. Successfully', async () => {
    // GIVEN mocked data from google
    /*eslint-disable @typescript-eslint/camelcase*/
    const googleData = {
      iss: 'accounts.google.com',
      azp: 'client_id',
      aud: 'app_id(maybe)',
      sub: '000009999911111000000',
      email: 'rlyNewEmail@iviche.com',
      email_verified: true,
      at_hash: 'Some-hash',
      name: 'New User',
      picture: 'photo-url',
      given_name: 'New',
      family_name: 'User',
      locale: 'en',
      iat: 1578326828,
      exp: 1578330428,
      jti: '0000000000000000000000000000000000000000',
    }
    /*eslint-enable */
    // AND mock get request to google services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForAuth'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN login POST is sent to /auth/login/google
    const response = await request(TestContext.app)
      .post('/auth/login/google')
      .send({ token: correctToken })
      .set('User-Agent', testUserAgent)

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND contain auth tokens
    expectCorrectTokens(response)

    // AND contain isNew field
    expect(response.body.isNew).toBeTruthy()

    // AND user successfully created
    const knex = container.resolve<Knex>('DBConnection')
    const userCheck = await knex<User | undefined>('users')
      .where('username', UsernameUtility.createGoogleUsername(googleData.sub))
      .innerJoin('person', 'person.uid', 'users.personUID')
      .first('email', 'firstName', 'lastName')
    expect(userCheck).not.toBeUndefined()
    expect(userCheck.email).toBe(googleData.email)
    expect(userCheck.firstName).toBe(googleData.given_name)
    expect(userCheck.lastName).toBe(googleData.family_name)
  })

  test('Login via google with correct token and firebaseDeviceToken. Successfully', async () => {
    // GIVEN mocked data from google
    /*eslint-disable @typescript-eslint/camelcase*/
    const googleData = {
      iss: 'accounts.google.com',
      azp: 'client_id',
      aud: 'app_id(maybe)',
      sub: userDetailsList[0].googleId as string,
      email: 'Kak_ya_lublu_prirodu@iviche.com',
      email_verified: true,
      at_hash: 'Some-hash',
      name: 'Nick Apelsin',
      picture: 'photo-url',
      given_name: 'Nick',
      family_name: 'Apelsin',
      locale: 'en',
      iat: 1578326828,
      exp: 1578330428,
      jti: '0000000000000000000000000000000000000000',
    }
    /*eslint-enable */
    // AND mock get request to google services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')
    // AND firebaseDeviceToken
    const firebaseDeviceToken = 'DeviceTokeeen'
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForAuth'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN login POST is sent to /auth/login/google
    const response = await request(TestContext.app)
      .post('/auth/login/google')
      .send({ token: correctToken, firebaseDeviceToken })
      .set('User-Agent', testUserAgent)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND contain auth tokens
    expectCorrectTokens(response)
    // AND contain isNew field
    expect(response.body.isNew).toBeFalsy()
    // AND device token must be added
    const authData = await knex<AuthData>('auth_data')
      .select('*')
      .where('username', usersList[0].username)
      .first()
    expect(authData?.firebaseDeviceToken).toBe(firebaseDeviceToken)
  })

  test('Login via google with correct token. Fail. Email is not verified', async () => {
    // GIVEN mocked data from google
    /*eslint-disable @typescript-eslint/camelcase*/
    const googleData = {
      iss: 'accounts.google.com',
      azp: 'client_id',
      aud: 'app_id(maybe)',
      sub: userDetailsList[0].googleId as string,
      email: 'Kak_ya_lublu_prirodu@iviche.com',
      email_verified: false,
      at_hash: 'Some-hash',
      name: 'Nick Apelsin',
      picture: 'photo-url',
      given_name: 'Nick',
      family_name: 'Apelsin',
      locale: 'en',
      iat: 1578326828,
      exp: 1578330428,
      jti: '0000000000000000000000000000000000000000',
    }
    /*eslint-enable */
    // AND mock get request to google services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/google
    const response = await request(TestContext.app)
      .post('/auth/login/google')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Google email is not verified',
      source: 'google',
      code: ForbiddenErrorCodes.EMAIL_IS_NOT_CONFIRMED,
    })
  })

  test('Registration via google with correct token. Fail. Email is already exist.', async () => {
    // GIVEN mocked data from google
    /*eslint-disable @typescript-eslint/camelcase*/
    const googleData = {
      iss: 'accounts.google.com',
      azp: 'client_id',
      aud: 'app_id(maybe)',
      sub: '01111111111111',
      email: personsList[11].email,
      email_verified: true,
      at_hash: 'Some-hash',
      name: 'Nick Apelsin',
      picture: 'photo-url',
      given_name: 'Nick',
      family_name: 'Apelsin',
      locale: 'en',
      iat: 1578326828,
      exp: 1578330428,
      jti: '0000000000000000000000000000000000000000',
    }
    /*eslint-enable */
    // AND mock get request to google services
    spy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForAuth'

    // WHEN login POST is sent to /auth/login/google
    const response = await request(TestContext.app)
      .post('/auth/login/google')
      .send({ token: correctToken })

    // THEN response must be fail
    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({
      message: `User with email ${personsList[11].email} already exists`,
      code: ConflictErrorCodes.EXIST_ERROR,
      source: 'google',
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
