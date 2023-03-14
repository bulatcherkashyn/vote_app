import 'reflect-metadata'

import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'
import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Moderation } from '../../../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationType } from '../../../../../src/iviche/moderation/model/ModerationType'
import { FacebookData } from '../../../../../src/iviche/security/auth/models/FacebookData'
import { AuthProvider } from '../../../../../src/iviche/security/auth/services/AuthProvider'
import { UserDetails } from '../../../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../../../src/iviche/users/models/UserSystemStatus'
import { AuthDataSeed } from '../../../../database/seeds/TestAuthData'
import {
  personsList,
  userDetailsList,
  userDetailsSeed,
  usersList,
} from '../../../../database/seeds/TestUserDetails'
import { publicUserProfile } from '../../../../unit/profiles/service/ProfileTestHelper'
import {
  facebookUserData,
  journalistData,
  limitedPublicUserData,
  primeAdminData,
  publicUserData,
  regularUserData,
  suspendedPublicUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

import SpyInstance = jest.SpyInstance

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('MyProfileController successful', () => {
  let authService: AuthProvider
  let facebookSpy: SpyInstance
  let googleSpy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([userDetailsSeed, AuthDataSeed])

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

  test('GET to /my-profile successfully', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/my-profile address
    const response = await request(TestContext.app)
      .get('/user-profile/my-profile')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(publicUserProfile)
  })

  test('GET to /my-profile with full info successfully ', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/my-profile?fullInfo=true address
    const response = await request(TestContext.app)
      .get('/user-profile/my-profile?fullInfo=true')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body.unreadNotificationsCount).toBeDefined()
    expect(response.body.myPollsCount).toBeDefined()
    expect(response.body.lastNotifications).toBeDefined()
  })

  test('GET to /my-profile when user SUSPENDED successfully ', async () => {
    // GIVEN application and public user data
    const knex = container.resolve<Knex>('DBConnection')
    await knex('users')
      .update({
        systemStatus: UserSystemStatus.REJECTED,
      })
      .where({ uid: facebookUserData.uid })

    await knex<Moderation>('moderation_case').insert({
      uid: '00000000-aaac-aaab-aaaa-000000000099',
      type: ModerationType.USER,
      reference: facebookUserData.uid,
      resolution: ModerationResolutionType.REJECTED,
      summary: 'You are little unicorn',
      concern: 'Banned hahaha',
    })
    // WHEN request is done to /user-profile/my-profile?fullInfo=true address
    const response = await request(TestContext.app)
      .get('/user-profile/my-profile')
      .set('Cookie', [`token=${facebookUserData.jwtToken}`])
    // THEN response must be successful
    expect(response.status).toBe(200)

    expect(response.body.moderationInfo).toBeDefined()
    expect(response.body.moderationInfo.summary).toEqual('You are little unicorn')
    expect(response.body.moderationInfo.concern).toEqual('Banned hahaha')
  })

  test('PUT to /user-profile/my-profile/person successfully with email username', async () => {
    // GIVEN  application, journalist credentials and a person data to be updated
    const personData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Firstname for PUT Person test',
      lastName: 'Lastname for PUT Person test',
      email: 'mykhailo.hrushevsky@iviche.com',
      socialStatus: SocialStatus.CLERK,
    }

    // WHEN request to /user-profile/my-profile/:username/person is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/person`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])
      .send(personData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('PUT by PublicUser to /user-profile/my-profile/avatar successfully with existing image uid', async () => {
    // WHEN placing avatar by request to /image is successfully done by PublicUser
    const imagePutResponse = await request(TestContext.app)
      .post(`/images`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .attach('name', './test/database/seeds/testAvatarImage.jpg')

    // THEN response must be successful with no content
    expect(imagePutResponse.status).toBe(200)
    // AND body should contain uuid of saved picture
    expect(imagePutResponse.body.uid).toHaveLength(36)

    // GIVEN application, public user credentials and uid of saved image
    // WHEN request to /user-profile/my-profile/:username/avatar is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/avatar`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send({
        avatar: imagePutResponse.body.uid,
      })

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('PUT to /user-profile/my-profile/user-details successfully', async () => {
    // GIVEN application, superuser credentials and a user-details data to be updated
    const detailsData: UserDetails = {
      notifyEmail: true,
      notifySMS: true,
      linkGoogle: 'blabla.com',
    }

    // WHEN request to /user-profile/my-profile/:username/user-details is done
    const response = await request(TestContext.app)
      .put('/user-profile/my-profile/user-details')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(detailsData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('PUT to /user-profile/my-profile/phone successfully (phone already added)', async () => {
    // GIVEN application and regular user data
    const password = regularUserData.password
    const newPhone = '380662807868'
    // WHEN request to /user-profile/my-profile/phone is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/phone`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ phone: newPhone, password })

    // THEN response must be successful with no content
    expect(response.status).toBe(202)
    // AND body should be empty
    expect(response.body).toStrictEqual('')
  })

  test('PUT to /user-profile/my-profile/phone successfully (phone is empty)', async () => {
    // GIVEN application and user data
    const password = 'PasswordForFirstPhoneChanging'
    const newPhone = '380662807868'
    // AND correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

    // AND get token
    const authorization = await request(TestContext.app)
      .post('/auth/login/direct')
      .send({ username: usersList[4].username, password: password })
      .set('User-Agent', testUserAgent)
    const cookie = authorization.header['set-cookie']

    // WHEN request to /user-profile/my-profile/phone is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/phone`)
      .set('Cookie', cookie)
      .send({ phone: newPhone })

    // THEN response must be successful with no content
    expect(response.status).toBe(202)
    // AND body should be empty
    expect(response.body).toStrictEqual('')
  })

  test('POST to /phone-confirmation/:phoneConfirmationCode successfully', async () => {
    // GIVEN application, user auth header and correct user-agent
    const testUserAgent =
      'Mozilla/6.0 (Windows NT 22.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
    const authorization = await request(TestContext.app)
      .post('/auth/login/direct')
      .send({ username: usersList[3].username, password: 'PasswordForPhoneConfiramtion' })
      .set('User-Agent', testUserAgent)
    const cookie = authorization.header['set-cookie']

    // WHEN request is done to /user-profile/my-profile/phone-confirmation/:phoneConfirmationCode address
    const response = await request(TestContext.app)
      .post(
        `/user-profile/my-profile/phone-confirmation/${userDetailsList[3].phoneConfirmationCode}`,
      )
      .set('Cookie', cookie)

    // THEN response must be successful
    expect(response.status).toBe(200)
  })

  test('GET to /phone-confirmation successfully', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/my-profile/phone-confirmation address
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/phone-confirmation')
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(202)
  })

  test('PUT to /user-profile/my-profile/email successfully (username is email)', async () => {
    // GIVEN application and regular user data
    const password = regularUserData.password
    const newEmail = 'test1@iviche.com'
    // WHEN request to /user-profile/my-profile/:username/email is done
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/email`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ email: newEmail, password })
    // THEN response must be successful with no content
    expect(response.status).toBe(202)
    // AND body should be empty
    expect(response.body).toStrictEqual('')
  })

  test('GET to /email-confirmation/:userEmailConfirmationCode successfully', async () => {
    // GIVEN application and email code
    // WHEN request is done to /user-profile/my-profile/email-confirmation/:userEmailConfirmationCode address
    const response = await request(TestContext.app).get(
      '/user-profile/my-profile/email-confirmation/qqqqqqqqq1',
    )

    // THEN response must be successful
    expect(response.status).toBe(302)
    const knex = container.resolve<Knex>('DBConnection')
    const user = await knex('users')
      .select('systemStatus')
      .where({ uid: userDetailsList[0].uid })
      .first()
    expect(user.systemStatus).toBe(UserSystemStatus.LIMITED)
  })

  test('GET to /email-confirmation successfully', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/my-profile/email-confirmation address
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/email-confirmation')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(202)
  })

  test('PUT to /password successfully', async () => {
    // GIVEN application and new password and regular user data
    const newPassword = 'New_pass1'

    // WHEN request is done to /user-profile/my-profile/password address
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/password`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ password: regularUserData.password, newPassword })

    // THEN response must be successful
    expect(response.status).toBe(202)
  })

  test('POST to /reset-password successfully', async () => {
    // GIVEN user email
    const email = personsList[0].email

    // WHEN POST request is done to /user-profile/my-profile/reset-password address
    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/reset-password`)
      .send({ email })

    // THEN response must be successful
    expect(response.status).toBe(200)
  })

  test('POST to /set-new-password successfully', async () => {
    // GIVEN application and new password and regular user data
    const body = {
      passwordRestorationCode: userDetailsList[1].passwordRestorationCode,
      newPassword: 'NewSuperPassword1',
    }

    const response = await request(TestContext.app)
      .post(`/user-profile/my-profile/set-new-password`)
      .send(body)

    // THEN response must be successful
    expect(response.status).toBe(202)
  })

  test('POST to /link-facebook successfully', async () => {
    // GIVEN Non-linked facebook id
    const FBData: FacebookData = {
      id: '1111111111111',
      email: 'testfacebook@iviche.com',
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

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(facebookSpy).toHaveBeenCalledWith(correctToken)
    // AND check that the facebookId was saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.facebookId).toEqual(FBData.id)
  })

  test('POST to /link-google successfully', async () => {
    // GIVEN Non-linked google id
    const googleData = {
      sub: '1111111111111',
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
      .post(`/user-profile/my-profile/link-google`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({ token: correctToken })

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(googleSpy).toHaveBeenCalledWith(correctToken)
    // AND check that the googleId was saved
    const checkDetail = await knex<UserDetails>('user_details')
      .select('*')
      .where({ uid: regularUserData.uid })
      .first()
    expect(checkDetail?.googleId).toEqual(googleData.sub)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
