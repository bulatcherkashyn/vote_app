import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import {
  ForbiddenErrorCodes,
  NotFoundErrorCodes,
  ValidationErrorCodes,
} from '../../../../../src/iviche/error/DetailErrorCodes'
import { User } from '../../../../../src/iviche/users/models/User'
import { UserSystemStatus } from '../../../../../src/iviche/users/models/UserSystemStatus'
import { primeAdminData, publicUserData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('ProfileController fail', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('GET to /user-profile/profiles/:email not found (email - facebook id)', async () => {
    // GIVEN application, superuser credentials profile data wrong email

    // WHEN get to /user-profile/profiles is done
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/111111111@facebook`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
  })

  test('PUT to /user-profile/profiles/:username/person wrong data', async () => {
    // GIVEN application, superuser credentials and a wrong person data to be updated
    const personData = {
      firstName: 'Firstname of person for PUT test',
      email: 'lesya.ukrainka@iviche.com',
    }

    // WHEN request to /user-profile/profiles/:username/person is done
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${personData.email}/person`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(personData)

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
      message: '"isLegalPerson" is required',
      source: 'isLegalPerson',
    })
  })

  test('PUT to /user-profile/profiles/:username/user-details wrong data', async () => {
    // GIVEN application, superuser credentials and a UserDetails data to be updated
    const detailsData = {
      notifyEmail: true,
      notifySMS: true,
      linkGoogle: true,
    }

    // WHEN request to /user-profile/profiles/:username/user-details is done
    const response = await request(TestContext.app)
      .put('/user-profile/profiles/lesya.ukrainka@iviche.com/user-details')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(detailsData)

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"linkGoogle" must be a string',
      source: 'linkGoogle',
      code: ValidationErrorCodes.FIELD_DATA_TYPE_VALIDATION_ERROR,
    })
  })

  test('PUT by PublicUser to /user-profile/profiles/:username/avatar failed', async () => {
    // GIVEN application, public user credentials and test avatar image
    // WHEN placing avatar image by request to /image is done by PublicUser
    const imagePutResponse = await request(TestContext.app)
      .post(`/images`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .attach('name', './test/database/seeds/testAvatarImage.jpg')

    // THEN response must be successful with no content
    expect(imagePutResponse.status).toBe(200)
    // AND body should contain uuid of saved picture
    expect(imagePutResponse.body.uid).toHaveLength(36)

    // GIVEN application, public user credentials, uid of successfully saved image and default PrimeAdmin username for which we are try to change avatar
    // WHEN request to /user-profile/my-profile/:username/avatar is done by PublicUser
    const avatarPutResponse = await request(TestContext.app)
      .put(`/user-profile/profiles/${primeAdminData.username}/avatar`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send({
        avatar: imagePutResponse.body.uid,
      })

    // THEN response must be failed
    expect(avatarPutResponse.status).toBe(403)
    // AND body should contain following Error
    expect(avatarPutResponse.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })

    // GIVEN application and default PrimeAdmin credentials
    // WHEN request to /user-profile/my-profile is done by PrimeAdmin
    const profileGetResponse = await request(TestContext.app)
      .get(`/user-profile/my-profile`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful with no content
    expect(profileGetResponse.status).toBe(200)

    // AND avatar field should be empty
    expect(profileGetResponse.body.person.avatar).toBeNull()
  })

  test('POST to /phone-confirmation/:phoneConfirmationCode FAIL:Code is string', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app)
      .post('/user-profile/my-profile/phone-confirmation/123a4w5b6')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"value" must be a number',
      source: 'validation',
      code: ValidationErrorCodes.FIELD_DATA_TYPE_VALIDATION_ERROR,
    })
  })

  test(`PUT to /unlink-facebook/:email FAIL. Email does not exist`, async () => {
    // GIVEN email of user
    const email = 'notExistingEmail@dewais.com'

    // WHEN request is done to /user-profile/profiles/unlink-facebook/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-facebook/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [user-details] entity for remove-facebookId',
      source: 'user-details',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })
  })

  test(`PUT to /unlink-google/:email FAIL. Email does not exist`, async () => {
    // GIVEN email of user
    const email = 'notExistingEmail@dewais.com'

    // WHEN request is done to /user-profile/profiles/unlink-google/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-google/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [user-details] entity for remove-googleId',
      source: 'user-details',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })
  })

  test(`PUT to /unlink-apple/:email FAIL. Email does not exist`, async () => {
    // GIVEN email of user
    const email = 'notExistingEmail@dewais.com'

    // WHEN request is done to /user-profile/profiles/unlink-apple/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-apple/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found [user-details] entity for remove-appleId',
      source: 'user-details',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })
  })

  test(`PUT to /user-language FAIL. unknown language `, async () => {
    // GIVEN UserToken
    // WHEN request is done to /user-profile/my-profile/user-language/:language
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/user-language/GE`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"language" must be one of [RU, UA, EN]',
      source: 'language',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test(`PUT by PublicUser to /:userId/ban failed.`, async () => {
    // GIVEN userid of user
    const userId = regularUserData.uid

    // THEN dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQueryBeforeRequest = knex<User>('users')
      .select('systemStatus')
      .where('uid', userId)
      .first()

    const userSystemStatusBeforeRequest = await checkQueryBeforeRequest

    // WHEN request is done to /user-profile/profiles/:userId/ban
    const changeSystemStatusResponse = await request(TestContext.app)
      .put(`/user-profile/profiles/${userId}/ban`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        systemStatus: UserSystemStatus.BANNED,
      })

    // THEN dbConnection with special query
    const checkQueryAfterRequest = knex<User>('users')
      .select('systemStatus')
      .where('uid', userId)
      .first()

    // AND userSystemStatus must be the same as before request
    const userSystemStatusAfterRequest = await checkQueryAfterRequest
    expect(userSystemStatusAfterRequest?.systemStatus).toBe(
      userSystemStatusBeforeRequest?.systemStatus,
    )

    // THEN response must be failed
    expect(changeSystemStatusResponse.status).toBe(403)
    // AND body should contain following Error
    expect(changeSystemStatusResponse.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
