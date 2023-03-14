import 'reflect-metadata'

import Knex from 'knex'
import { DateTime } from 'luxon'
import request from 'supertest'
import { container } from 'tsyringe'
import { UAParser } from 'ua-parser-js'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../../../../../src/iviche/common/utils/DateUtility'
import { AuthErrorCodes } from '../../../../../../src/iviche/error/DetailErrorCodes'
import { AuthData } from '../../../../../../src/iviche/security/auth/models/AuthData'
import { AuthProviderImpl } from '../../../../../../src/iviche/security/auth/services/AuthProviderImpl'
import { regularUserData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'
import { expectCorrectTokens } from './authHelper'

describe('AuthController', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('Refresh web client token. Success', async () => {
    // GIVEN refresh token in DB
    const knex = container.resolve<Knex>('DBConnection')
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }
    const refreshToken = uuidv4()
    const username = regularUserData.username
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', testUserAgent)

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND there should be 1 auth session
    const authData = await knex<AuthData>('auth_data').select('*')
    expect(authData?.length).toBe(1)

    // AND contain auth tokens
    expectCorrectTokens(response)
  })

  test('Refresh token. Failed with incorrect refresh token', async () => {
    // GIVEN incorrect refresh token
    const refreshToken = uuidv4()

    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', testUserAgent)

    // THEN response should return 400
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Authentication is not possible')
    expect(response.body.source).toBe('refresh-token')
    expect(response.body.code).toBe(AuthErrorCodes.AUTH_DATA_BY_REFRESH_TOKEN_NOT_FOUND)
  })

  test('Web client refresh token failed with incorrect foot print', async () => {
    // GIVEN refresh token in DB with refreshTokenHash generated from testUserAgent foot print
    const knex = container.resolve<Knex>('DBConnection')
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    // AND incorrect user-agent for request
    const differentTestUserAgent =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
    const headerInfo = {
      ip: 'XX32',
      userAgent: new UAParser(testUserAgent).getResult(),
    }
    const refreshToken = uuidv4()
    const username = regularUserData.username
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '12334',
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', differentTestUserAgent)

    // THEN response should return 400
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Token refresh not allowed')
    expect(response.body.source).toBe('refresh-token')
    expect(response.body.code).toBe(AuthErrorCodes.REFRESH_TOKEN_DOESNT_MATCH)
  })

  test('Refresh token. Refresh should failed with no auth data', async () => {
    // GIVEN refresh token in DB with refreshTokenHash generated from testUserAgent foot print
    const knex = container.resolve<Knex>('DBConnection')
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }
    const refreshToken = uuidv4()
    const username = regularUserData.username
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to refresh token with no auth data
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', '')

    // THEN response should return 400
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Browser and OS cannot be defined')
    expect(response.body.source).toBe('user-agent')
    expect(response.body.code).toBe(AuthErrorCodes.INCORRECT_USER_AGENT)
  })

  test('Web client refresh token failed with expired refresh token', async () => {
    // GIVEN expired refresh token in DB
    const knex = container.resolve<Knex>('DBConnection')
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }
    const refreshToken = uuidv4()
    const username = regularUserData.username
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      refreshTokenHash: hash,
      createdAt: DateTime.utc().minus({ days: 61 }),
    })

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', testUserAgent)

    // THEN response should return 401
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('RefreshToken has expired')
  })

  test("Web client refresh token. Refresh doesn't remove session device info", async () => {
    // GIVEN refresh token in DB
    const knex = container.resolve<Knex>('DBConnection')
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }
    const refreshToken = uuidv4()
    const username = regularUserData.username
    const firebaseDeviceToken = 'tokeeen123'
    const hash = new AuthProviderImpl().getWebClientRefreshTokenHash(refreshToken, headerInfo)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      firebaseDeviceToken,
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken })
      .set('User-Agent', testUserAgent)

    // AND there should be 4 auth session
    const authData = await knex<AuthData>('auth_data').select('*')
    expect(authData?.length).toBe(4)
    // AND firebaseDeviceToken and deviceID remain the same
    expect(authData[3].firebaseDeviceToken).toBe(firebaseDeviceToken)

    // AND contain auth tokens
    expectCorrectTokens(response)
  })

  test("Mobile app refresh token. Refresh doesn't remove session device info", async () => {
    // GIVEN refresh token in DB
    const knex = container.resolve<Knex>('DBConnection')
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo = {
      ip: '::ffff:127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }

    const refreshToken = uuidv4()
    const username = regularUserData.username
    const firebaseDeviceToken = 'tokeeen123'
    const deviceID = 'someCoolDeviceID'
    const hash = new AuthProviderImpl().getMobileAppRefreshTokenHash(refreshToken, deviceID)
    await knex('auth_data').insert({
      uid: refreshToken,
      username,
      headerInfo: headerInfo.userAgent.ua,
      deviceToken: '123',
      firebaseDeviceToken,
      deviceID,
      refreshTokenHash: hash,
      createdAt: DateUtility.now(),
    })

    // WHEN try to refresh token
    const response = await request(TestContext.app)
      .post('/auth/refresh')
      .send({ refreshToken, deviceID })

    // AND there should be 5 auth session
    const authData = await knex<AuthData>('auth_data').select('*')
    expect(authData?.length).toBe(5)
    // AND firebaseDeviceToken and deviceID remain the same
    expect(authData[4].firebaseDeviceToken).toBe(firebaseDeviceToken)
    expect(authData[4].deviceID).toBe(deviceID)

    // AND contain auth tokens
    expectCorrectTokens(response)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
