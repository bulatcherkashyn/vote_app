import 'reflect-metadata'

import request from 'supertest'

import {
  AuthErrorCodes,
  ConflictErrorCodes,
  ForbiddenErrorCodes,
  ValidationErrorCodes,
} from '../../../../../../src/iviche/error/DetailErrorCodes'
import { bannedPublicUserData, primeAdminData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'

describe('AuthController', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Wrong password', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: primeAdminData.username,
      password: primeAdminData.password + '!',
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 401
    expect(response.status).toBe(401)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      code: AuthErrorCodes.DONT_MATCH_ERROR,
      message: "Username/password don't match",
      source: 'login',
    })
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Wrong username', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: 'test' + primeAdminData.username,
      password: primeAdminData.password,
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 401
    expect(response.status).toBe(401)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      code: AuthErrorCodes.DONT_MATCH_ERROR,
      message: "Username/password don't match",
      source: 'login',
    })
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Empty username field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: '',
      password: primeAdminData.password,
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"username" is not allowed to be empty',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Empty password field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: primeAdminData.username,
      password: '',
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"password" is not allowed to be empty',
      source: 'password',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Without username field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      password: primeAdminData.password,
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"username" is required',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('LOGIN: Unsuccessful login with incorrect credentials. Without password field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: primeAdminData.username,
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"password" is required',
      source: 'password',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('LOGIN: Unsuccessful login with banned system status. Banned user', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: bannedPublicUserData.username,
      password: bannedPublicUserData.password,
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/login/direct')
      .send(credentials)

    // THEN response must be 403
    expect(response.status).toBe(403)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      code: ForbiddenErrorCodes.USER_BANNED,
      message: 'User banned',
      source: 'system-status',
    })
  })

  test('REGISTRATION: Unsuccessful registration with incorrect credentials. Without email field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      password: 'Dewais123!',
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/registration')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"username" is required',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('REGISTRATION: Unsuccessful registration with incorrect credentials. Without password field', async () => {
    // GIVEN incorrect user credentials
    const credentials = {
      username: 'test.user@dewais.com',
    }

    // WHEN login POST is sent to /auth/login/direct
    const response = await request(TestContext.app)
      .post('/auth/registration')
      .send(credentials)

    // THEN response must be 400
    expect(response.status).toBe(400)

    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: '"password" is required',
      source: 'password',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('REGISTRATION: Unsuccessful registration with correct credentials. User with email is already registered', async () => {
    // GIVEN correct user credentials
    const credentials = {
      username: primeAdminData.username,
      password: primeAdminData.password,
    }

    // WHEN login POST is sent to /auth/registration
    const response = await request(TestContext.app)
      .post('/auth/registration')
      .send(credentials)

    // THEN response must be 409
    expect(response.status).toBe(409)
    // AND body contain a message
    expect(response.body).toStrictEqual({
      code: ConflictErrorCodes.EXIST_ERROR,
      message: 'User with email pericles@iviche.com already exists',
      source: 'email',
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
