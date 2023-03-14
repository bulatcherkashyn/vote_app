import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import {
  ConflictErrorCodes,
  ForbiddenErrorCodes,
  NotFoundErrorCodes,
  ValidationErrorCodes,
} from '../../../../../src/iviche/error/DetailErrorCodes'
import { AuthProvider } from '../../../../../src/iviche/security/auth/services/AuthProvider'
import {
  personsList,
  userDetailsList,
  userDetailsSeed,
} from '../../../../database/seeds/TestUserDetails'
import { createRandomString } from '../../../../unit/common/TestUtilities'
import {
  limitedPublicUserData,
  publicUserData,
  regularUserData,
  suspendedPublicUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

import SpyInstance = jest.SpyInstance
import { FacebookData } from '../../../../../src/iviche/security/auth/models/FacebookData'
import Knex = require('knex')
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'

import { UserDetails } from '../../../../../src/iviche/users/models/UserDetails'
import { details } from '../../../../database/seeds/01_InitialData'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('MyProfileController fail', () => {
  let authService: AuthProvider
  let facebookSpy: SpyInstance
  let googleSpy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([userDetailsSeed])

    authService = container.resolve('AuthProvider')
    facebookSpy = jest.spyOn(authService, 'decodeFacebookToken')
    googleSpy = jest.spyOn(authService, 'decodeGoogleToken')
    done()
  })

  beforeEach(() => {
    // NOTE: for future tests with nodemailer
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('PUT to /user-profile/my-profile/email without password - fail', async () => {
    // GIVEN application and new phone
    const newEmail = 'vadim1299@ukr.net'
    // WHEN request to /user-profile/my-profile/phone is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/email`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ email: newEmail })

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"password" is required',
      source: 'password',
      code: 400001,
    })
  })

  test('PUT to /user-profile/my-profile/email email already exist', async () => {
    // GIVEN application, correct password and already existing email
    const password = regularUserData.password
    const newEmail = personsList[0].email

    // WHEN request to /user-profile/my-profile/email is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/email`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ email: newEmail, password })

    // THEN response must be fail
    expect(response.status).toBe(409)
    // AND body contains message
    expect(response.body.message).toBe('Email is already exits')
  })

  test('PUT to /user-profile/my-profile/avatar failed when image uid does not exist in db', async () => {
    // GIVEN application, public user credentials and uid of image that doesn't exist in db
    const notExistingImageUid = '9bfe32c8-861a-4c2b-b9e7-e54c59a234cf'

    // WHEN request to /user-profile/my-profile/:username/avatar is done
    const avatarPutResponse = await request(TestContext.app)
      .put(`/user-profile/my-profile/avatar`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send({
        avatar: notExistingImageUid,
      })

    // THEN response must be successful with no content
    expect(avatarPutResponse.status).toBe(404)
    // AND body should contain error
    expect(avatarPutResponse.body).toStrictEqual({
      message: 'Reference not found',
      source: 'person_avatar_foreign',
      code: 404002,
    })
  })

  test('GET to /phone-confirmation fail (too many resend requests)', async () => {
    // GIVEN first resend phone code request
    const firstResendResponse = await request(TestContext.app)
      .post('/user-profile/my-profile/phone-confirmation')
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])

    expect(firstResendResponse.status).toBe(202)

    // WHEN request to /user-profile/my-profile/phone-confirmation is done within two minutes
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/phone-confirmation')
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])

    // THEN got error
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: 'Too many re-sending phone code requests',
      source: 'profile',
      code: ValidationErrorCodes.TOO_MANY_RESENDING_CODE_ERROR,
    })
  })

  test('GET to /phone-confirmation fail (phone not found)', async () => {
    // GIVEN facebook user credentials (user without phone number)
    // WHEN request to /user-profile/my-profile/phone-confirmation is done
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/phone-confirmation')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])

    // THEN got error
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [profile] entity for get-phone',
      source: 'phone',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })
  })

  test('GET to /email-confirmation fail (too many resend requests)', async () => {
    // GIVEN first resend email code request
    const firstResendResponse = await request(TestContext.app)
      .post('/user-profile/my-profile/email-confirmation')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])

    expect(firstResendResponse.status).toBe(202)

    // WHEN request to /user-profile/my-profile/email-confirmation is done within two minutes
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/email-confirmation')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])

    // THEN got error
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: 'Too many re-sending email code requests',
      source: 'profile',
      code: ValidationErrorCodes.TOO_MANY_RESENDING_CODE_ERROR,
    })
  })

  test('POST to /reset-password fail. Not existing email', async () => {
    // GIVEN not existing email
    const email = 'notExistingEmail@iviche.co'

    // WHEN POST request is done to /user-profile/my-profile/reset-password address
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/reset-password`)
      .send({ email })

    // THEN got error
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'User is not found',
      source: 'my-profile',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })
  })
  test('POST to /reset-password fail (too many reset password requests)', async () => {
    // GIVEN user email
    const email = personsList[0].email

    // AND first POST request is done to /user-profile/my-profile/reset-password address
    const firstResetPasswordResponse = await request(TestContext.app)
      .post(`/user-profile/my-profile/reset-password`)
      .send({ email })
    expect(firstResetPasswordResponse.status).toBe(200)

    // WHEN second POST request is done to /user-profile/my-profile/reset-password address
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/reset-password`)
      .send({ email })

    // THEN got error
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: 'Too many re-sending password code requests',
      source: 'profile',
      code: ValidationErrorCodes.TOO_MANY_RESENDING_CODE_ERROR,
    })
  })

  test('POST to /set-new-password fail. Not existing password restoration code', async () => {
    // GIVEN application and new password and regular user data
    const body = {
      passwordRestorationCode: createRandomString(128),
      newPassword: 'NewSuperPassword1',
    }

    // WHEN POST request is done to /user-profile/my-profile/set-new-password address
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/set-new-password`)
      .send(body)

    // THEN got error
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [user] entity for set-new-password',
      source: 'user',
      code: 404002,
    })
  })

  test('POST to /set-new-password fail. Expired password restoration code', async () => {
    // GIVEN application and new password and regular user data
    const body = {
      passwordRestorationCode: userDetailsList[2].passwordRestorationCode,
      newPassword: 'NewPassword1',
    }

    // WHEN POST request is done to /user-profile/my-profile/set-new-password address
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/set-new-password`)
      .send(body)

    // THEN got error
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [user] entity for set-new-password',
      source: 'user',
      code: 404002,
    })
  })

  test('POST to /link-facebook fail. Facebook account already linked', async () => {
    // GIVEN already existing facebook id
    const FBData: FacebookData = {
      id: details[6].facebookId as string,
      email: 'test@iviche.com',
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services
    facebookSpy.mockImplementationOnce(() => {
      return Promise.resolve(FBData)
    })
    // AND correct user token
    const correctToken = 'correctFacebookAuthTokenForLinking'
    // AND db connection to check results
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN POST request is sent to /user-profile/my-profile/link-facebook
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/link-facebook`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ token: correctToken })

    // THEN got error
    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({
      message: 'Facebook account already linked',
      source: 'facebook',
      code: ConflictErrorCodes.EXIST_ERROR,
    })
    expect(facebookSpy).toHaveBeenCalledWith(correctToken)

    // AND check that the facebook id was not saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.facebookId).toBeNull()
  })

  test('POST to /link-facebook fail. Facebook account without email', async () => {
    // GIVEN facebook account without email
    const FBData: FacebookData = {
      id: '1234567',
      first_name: 'Test', // eslint-disable-line @typescript-eslint/camelcase
      last_name: 'Testovich', // eslint-disable-line @typescript-eslint/camelcase
    }
    // AND mock get request to fb services
    facebookSpy.mockImplementationOnce(() => {
      return Promise.resolve(FBData)
    })
    // AND correct user token
    const correctToken = 'correctFacebookAuthTokenForLinking'
    // AND db connection to check results
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN POST request is sent to /user-profile/my-profile/link-facebook
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/link-facebook`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ token: correctToken })

    // THEN got error
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: `Facebook's email is empty`,
      source: 'facebook',
      code: ForbiddenErrorCodes.NO_EMAIL_ON_FACEBOOK,
    })
    expect(facebookSpy).toHaveBeenCalledWith(correctToken)

    // AND check that the facebook id was not saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.facebookId).toBeNull()
  })

  test('POST to /link-google fail. Google account already linked', async () => {
    // GIVEN already existing google id
    const googleData = {
      sub: details[7].googleId as string,
      email_verified: true, // eslint-disable-line @typescript-eslint/camelcase
    } as TokenPayload

    // AND mock get request to google services
    googleSpy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForLinking'
    // AND db connection to check results
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN POST request is sent to /user-profile/my-profile/link-google
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/link-google')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ token: correctToken })

    // THEN got error
    expect(response.status).toBe(409)
    expect(response.body).toStrictEqual({
      message: 'Google account already linked',
      source: 'google',
      code: ConflictErrorCodes.EXIST_ERROR,
    })
    expect(googleSpy).toHaveBeenCalledWith(correctToken)
    // AND check that the googleId was not saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.googleId).toBeNull()
  })

  test('POST to /link-google fail. Google account email is not confirmed', async () => {
    // GIVEN unconfirmed email in google account
    const googleData = {
      sub: '123123123',
      email_verified: false, // eslint-disable-line @typescript-eslint/camelcase
    } as TokenPayload

    // AND mock get request to google services
    googleSpy.mockImplementationOnce(() => {
      return Promise.resolve(googleData)
    })
    // AND correct user token
    const correctToken = 'correctGoogleAuthTokenForLinking'
    // AND db connection to check results
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN POST request is sent to /user-profile/my-profile/link-google
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/link-google`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ token: correctToken })

    // THEN got error
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Google email is not verified',
      source: 'google',
      code: ForbiddenErrorCodes.EMAIL_IS_NOT_CONFIRMED,
    })
    expect(googleSpy).toHaveBeenCalledWith(correctToken)
    // AND check that the googleId was not saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.googleId).toBeNull()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
