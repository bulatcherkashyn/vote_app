import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'
import { UAParser } from 'ua-parser-js'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../../../../../src/iviche/common/utils/DateUtility'
import { AuthData } from '../../../../../../src/iviche/security/auth/models/AuthData'
import { AuthProviderImpl } from '../../../../../../src/iviche/security/auth/services/AuthProviderImpl'
import { AuthDataSeed } from '../../../../../database/seeds/TestAuthData'
import {
  legalUserData,
  moderatorData,
  publicUserData,
  regularUserData,
} from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'
import { expectCorrectTokens } from './authHelper'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('AuthController', () => {
  beforeAll(async done => {
    await TestContext.initialize([AuthDataSeed])
    done()
  })

  beforeEach(() => {
    // NOTE: for future tests with nodemailer
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('login with correct credentials', async () => {
    // GIVEN correct user credentials. Without device token
    const credentials = {
      username: regularUserData.username,
      password: regularUserData.password,
    }
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')
    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)
      .set('User-Agent', testUserAgent)
    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND contain auth tokens
    expectCorrectTokens(response)
    // AND device token is undefined
    const authData = await knex<AuthData>('auth_data')
      .select('*')
      .where('username', credentials.username)
      .first()
    expect(authData?.username).toEqual(credentials.username)
  })

  test('revoke and update mobile user session on login using deviceID', async () => {
    // GIVEN correct user credentials
    const credentials = {
      username: publicUserData.username,
      password: publicUserData.password,
      deviceID: 'coolDeviceID',
      firebaseDeviceToken: 'anotherFirebaseDeviceToken',
    }

    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND contain auth tokens
    expectCorrectTokens(response)
    const authData = await knex<AuthData>('auth_data').select('*')

    // AND there should be only one user with publicUser credentials
    expect(authData.filter(it => it.username === credentials.username).length).toBe(1)
  })

  test.skip('revoke and update user session on login using deviceToken', async () => {
    // We allow to change ip, so revoke web client sessions using deviceToken won't work.
    // GIVEN correct user credentials
    const credentials = {
      username: regularUserData.username,
      password: regularUserData.password,
    }
    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND contain auth tokens
    expectCorrectTokens(response)

    const authData = await knex<AuthData>('auth_data').select('*')

    // AND there should be 3 auth sessions
    expect(authData?.length).toBe(2)
  })

  test('drop mobile app exceeding sessions on login', async () => {
    const deviceID = 'coolDeviceID5'
    // GIVEN 5 exceeding mobile app user sessions
    const exceedingSessions = [
      { username: moderatorData.username, deviceID },
      { username: moderatorData.username, deviceID },
      { username: moderatorData.username, deviceID },
      { username: moderatorData.username, deviceID },
      { username: moderatorData.username, deviceID },
    ].map((it, index) => {
      const headerInfo = {
        ip: '::ffff:127.0.0.1',
        userAgent: new UAParser().getResult(),
      }
      const refreshToken = uuidv4()
      const hash = new AuthProviderImpl().getMobileAppRefreshTokenHash(refreshToken, deviceID)
      return {
        uid: refreshToken,
        username: it.username,
        headerInfo,
        deviceID,
        deviceToken: `coolDeviceToken${index}`,
        refreshTokenHash: hash,
        createdAt: DateUtility.now(),
      }
    })
    // AND correct user login credentials
    const credentials = {
      username: moderatorData.username,
      password: moderatorData.password,
      deviceID,
    }
    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')
    // AND there are 3 public user sessions
    await knex('auth_data').insert(exceedingSessions)
    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND there should be only 1 user session left (except 3 public user sessions)
    expectCorrectTokens(response)

    const authData = await knex<AuthData>('auth_data').select('*')
    // AND there should be 4 auth sessions
    expect(authData?.length).toBe(4)
    // AND there should be only one user with public user credentials
    expect(authData.filter(it => it.username === credentials.username).length).toBe(1)
  })

  test('register with correct credentials', async () => {
    // AND correct user credentials
    const credentials = {
      username: 'test.user@dewais.com',
      password: '123Dewais!',
    }
    // WHEN login POST is sent to /auth/registration
    const response = await request(TestContext.app)
      .post('/auth/registration')
      .send(credentials)

    // THEN response must be successful
    expect(response.status).toBe(201)
  })

  test('Web client Logout removes user session', async () => {
    // GIVEN refresh token in DB (4 sessions)
    const knex = container.resolve<Knex>('DBConnection')
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }

    const refreshToken = uuidv4()
    const username = legalUserData.username
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    // THEN add 5th session to auth_data with legal user username
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to logout a legal user
    await request(TestContext.app)
      .post('/auth/logout')
      .send({ refreshToken })
      .set('User-Agent', testUserAgent)

    const authData = await knex<AuthData>('auth_data').select('*')
    // THEN the session is removed and 4 sessions left
    expect(authData?.length).toBe(4)
  })

  test('Mobile app Logout removes user session', async () => {
    // GIVEN refresh token in DB (4 sessions)
    const knex = container.resolve<Knex>('DBConnection')
    // AND anything as authHeader in case of Mobile app logout
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser().getResult(),
    }
    const refreshToken = uuidv4()
    const deviceID = uuidv4()
    const username = legalUserData.username
    const hash = new AuthProviderImpl().getMobileAppRefreshTokenHash(refreshToken, deviceID)
    // THEN add 5th session to auth_data with legal user username
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo,
      deviceToken: '123',
      refreshTokenHash: hash,
      deviceID,
      createdAt: DateUtility.now(),
    })

    // WHEN try to logout a legal user
    await request(TestContext.app)
      .post('/auth/logout')
      .send({ refreshToken, deviceID })

    const authData = await knex<AuthData>('auth_data').select('*')
    // THEN the session is removed and 4 sessions left
    expect(authData?.length).toBe(4)
  })

  test('login using deviceID', async () => {
    // AND correct user credentials
    const credentials = {
      username: moderatorData.username,
      password: moderatorData.password,
      deviceID: 'testNewLoginWithSomeCoolDeviceID',
    }
    // AND db connection for result check
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN login POST is sent to /auth/login/google
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    const authData = await knex<AuthData>('auth_data').select('*')
    // THEN response must be successful
    expect(response.status).toBe(200)
    // THEN a new session with deviceID is added
    expect(authData.length).toBe(5)
    expect(authData[4].deviceID).toBe(credentials.deviceID)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
