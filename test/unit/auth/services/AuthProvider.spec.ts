import 'reflect-metadata'

import axios from 'axios'
import { LoginTicket } from 'google-auth-library/build/src/auth/loginticket'
import jwt from 'jsonwebtoken'
import { UAParser } from 'ua-parser-js'
import uuidv4 from 'uuid/v4'

import { EnvironmentMode } from '../../../../src/iviche/common/EnvironmentMode'
import { AuthErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { ServerError } from '../../../../src/iviche/error/ServerError'
import { HeaderInfo } from '../../../../src/iviche/security/auth/models/HeaderInfo'
import { JwtObject } from '../../../../src/iviche/security/auth/models/JwtObject'
import { AuthProviderImpl } from '../../../../src/iviche/security/auth/services/AuthProviderImpl'

jest.mock('google-auth-library')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2Client } = require('google-auth-library')

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const authProvider = new AuthProviderImpl()

describe('AuthProvider tests', () => {
  test('successful getWebClientRefreshTokenHash', () => {
    // GIVEN uuid with headerInfo
    const uuid = uuidv4()
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo: HeaderInfo = {
      ip: '127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }

    // WHEN getWebClientRefreshTokenHash
    const hash = authProvider.getWebClientRefreshTokenHash(uuid, headerInfo)

    // THEN hash length should be 88
    expect(hash.length).toBe(88)
  })

  test('unsuccessful getWebClientRefreshTokenHash without userAgent', () => {
    // GIVEN uuid with empty userAgent
    const uuid = uuidv4()
    const headerInfo: HeaderInfo = { ip: '127.0.0.1', userAgent: {} as IUAParser.IResult }

    // WHEN getWebClientRefreshTokenHash
    try {
      authProvider.getWebClientRefreshTokenHash(uuid, headerInfo)
    } catch (error) {
      // THEN catch ServerError
      expect(error.message).toBe('Browser and OS cannot be defined')
      expect(error).toBeInstanceOf(ServerError)
      expect(error.source).toBe('user-agent')
      expect(error.code).toBe(AuthErrorCodes.INCORRECT_USER_AGENT)
    }
  })

  test('successful getMobileAppRefreshTokenHash', () => {
    // GIVEN uuid with deviceID
    const uuid = uuidv4()
    const deviceID = uuidv4()

    // WHEN getMobileAppRefreshTokenHash
    const hash = authProvider.getMobileAppRefreshTokenHash(uuid, deviceID)

    // THEN hash length should be 88
    expect(hash.length).toBe(88)
  })

  test('getAuthToken', () => {
    // GIVEN username
    const uid = uuidv4()

    // WHEN generate auth token
    const jwtToken = authProvider.getAuthToken(uid)

    // THEN verify jwt token with secret
    const secret = authProvider['jwtSecret']
    const decoded = jwt.verify(
      jwtToken.split(' ')[1],
      Buffer.alloc(secret.length, secret, 'base64'),
    ) as JwtObject
    expect(decoded.userUID).toEqual(uid)
  })

  test('getWebClientRefreshToken', () => {
    // GIVEN correct authHeader
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const headerInfo: HeaderInfo = {
      ip: '127.0.0.1',
      userAgent: new UAParser(testUserAgent).getResult(),
    }

    // WHEN generate refresh token
    const refreshToken = authProvider.getRefreshToken(headerInfo)

    // THEN verify refreshToken object for lengths
    expect(refreshToken.token.length).toBe(36)
    expect(refreshToken.hash.length).toBe(88)
  })

  test('getMobileAppRefreshToken', () => {
    // GIVEN deviceID
    const deviceID = uuidv4()

    // AND anything as authHeader in case of mobile device
    const headerInfo: HeaderInfo = {
      ip: '127.0.0.1',
      userAgent: new UAParser().getResult(),
    }

    // WHEN generate refresh token
    const refreshToken = authProvider.getRefreshToken(headerInfo, deviceID)

    // THEN verify refreshToken object for lengths
    expect(refreshToken.token.length).toBe(36)
    expect(refreshToken.hash.length).toBe(88)
  })

  test('extractJwtFromAuthToken Success', async () => {
    // GIVEN correct auth header
    const authHeader = `jwt someJwtToken`
    // WHEN getToken with success result
    const token = authProvider['extractJwtFromAuthToken'](authHeader)
    // THEN token has to be returned
    expect(token).toEqual('someJwtToken')
  })

  test('extractJwtFromAuthToken Failed undefined authHeader', async () => {
    // GIVEN failed auth header
    const authHeader = undefined

    // WHEN getToken with failed result
    try {
      authProvider['extractJwtFromAuthToken'](authHeader)
    } catch (e) {
      //THEN catch error
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toEqual('No auth token')
    }
  })

  test('extractJwtFromAuthToken Failed invalid prefix', async () => {
    // GIVEN failed header with invalid prefix
    const authHeader = 'jwtt someJwtToken'

    // WHEN getToken with failed result
    try {
      authProvider['extractJwtFromAuthToken'](authHeader)
    } catch (e) {
      //THEN catch error
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toEqual('Incorrect access token')
    }
  })

  test('extractJwtFromAuthToken Failed undefined token', async () => {
    // GIVEN failed auth header
    const authHeader = 'jwt'

    // WHEN getToken with failed result
    try {
      authProvider['extractJwtFromAuthToken'](authHeader)
    } catch (e) {
      //THEN catch error
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toEqual('Incorrect access token')
    }
  })

  test('decodeAuthToken Success', async () => {
    // GIVEN correct auth token
    const secret = authProvider['jwtSecret']
    const username = 'VadimTiUvolen'
    const jwtToken = jwt.sign({ username }, Buffer.alloc(secret.length, secret, 'base64'))

    // WHEN decode auth token
    const returnedUsername = authProvider.decodeAuthToken('jwt ' + jwtToken)

    // THEN correct username has been returned
    expect(returnedUsername.username).toEqual(username)
  })

  test('decodeAuthToken Failed. Expired', async () => {
    // GIVEN jwt token with some error
    const secret = authProvider['jwtSecret']
    const username = 'ladnoShuchu<3'
    const jwtToken = jwt.sign({ username }, Buffer.alloc(secret.length, secret, 'base64'), {
      expiresIn: 0,
    })

    // WHEN decode JWT
    try {
      authProvider.decodeAuthToken('jwt ' + jwtToken)
      expect(true).toBe(false)
    } catch (e) {
      // THEN catch ServerError
      expect(e).toBeInstanceOf(ServerError)
      expect(e.code).toBe(401005)
    }
  })

  test('decodeAuthToken Failed. Invalid signature', async () => {
    // GIVEN jwt token with some error
    const secret = authProvider['jwtSecret']
    const username = 'ladnoShuchu<3'
    const jwtToken = jwt.sign({ username }, Buffer.alloc(secret.length, secret, 'base64'))

    // WHEN decode JWT
    try {
      authProvider.decodeAuthToken('jwt ' + jwtToken + 'H')
      expect(true).toBe(false)
    } catch (e) {
      // THEN catch ServerError
      expect(e).toBeInstanceOf(ServerError)
      expect(e.code).toBe(401006)
    }
  })

  test('decodeGoogleToken Failed google cant decode token', async () => {
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: async (): Promise<Partial<LoginTicket>> => {
        throw new Error("Some google error which don't have code or name...")
      },
    }))

    // GIVEN google token
    const googleToken = 'NickGoogleToken'

    // WHEN decode google token
    try {
      const authProvider = new AuthProviderImpl()
      await authProvider.decodeGoogleToken(googleToken)
      expect(true).toBe(false)
    } catch (e) {
      // THEN catch ServerError
      expect(e).toBeInstanceOf(ServerError)
    }
  })

  test('decodeGoogleToken Failed decoded token not have payload', async () => {
    OAuth2Client.mockImplementation(() => ({
      verifyIdToken: async (): Promise<Partial<LoginTicket>> => ({
        getPayload: (): undefined => undefined,
      }),
    }))

    // GIVEN google token
    const googleToken = 'NickGoogleToken'

    // WHEN decode google token
    try {
      const authProvider = new AuthProviderImpl()
      await authProvider.decodeGoogleToken(googleToken)
      expect(true).toBe(false)
    } catch (e) {
      // THEN catch ServerError
      expect(e).toBeInstanceOf(ServerError)
    }
  })

  test('authProvider creating token for prod', async () => {
    // GIVEN production env
    process.env.NODE_ENV = EnvironmentMode.PRODUCTION
    process.env.JWT_SECRET = 'secret_for_tests'

    // WHEN create authProvider
    const authProvider = new AuthProviderImpl()
    // THEN auth Provider created
    expect(typeof authProvider).toEqual('object')
  })

  test('decodeFacebookToken Failed', async () => {
    // GIVEN mock get request to fb services (error)
    mockedAxios.get.mockImplementationOnce(() => {
      throw new Error('Expected error by request to facebook api')
    })
    // AND correct user token
    const correctToken = 'correctFacebookAuthTokenForAuth'

    // WHEN decode google token
    try {
      const authProvider = new AuthProviderImpl()
      await authProvider.decodeFacebookToken(correctToken)
    } catch (error) {
      // THEN catch ServerError
      expect(error.message).toBe('Failed to login via facebook')
      expect(error).toBeInstanceOf(ServerError)
      expect(error.code).toBe(401000)
    }
  })
})
