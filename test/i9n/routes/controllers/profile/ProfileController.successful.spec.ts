import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Language } from '../../../../../src/iviche/common/Language'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../../../src/iviche/common/utils/DateUtility'
import { PaginationMetadata } from '../../../../../src/iviche/generic/model/PaginationMetadata'
import { User } from '../../../../../src/iviche/users/models/User'
import { UserDetails } from '../../../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../../../src/iviche/users/models/UserSystemStatus'
import { personsList, userDetailsSeed, usersList } from '../../../../database/seeds/TestUserDetails'
import {
  administratorData,
  googleUserData,
  journalistData,
  primeAdminData,
  regularUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import { profileList } from './ProfileHelper'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('ProfileController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([userDetailsSeed])
    done()
  })

  beforeEach(() => {
    // NOTE: for future tests with nodemailer
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('GET to /user-profile/profiles successfully', async () => {
    // GIVEN application and superuser credentials, expected result
    const expectedMetadata: PaginationMetadata = {
      limit: 100,
      offset: 0,
      total: profileList.length,
    }
    const expectedList = profileList

    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app)
      .get('/user-profile/profiles')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain expected metadata and expected list data
    expect(response.body.metadata).toStrictEqual(expectedMetadata)
    expect(response.body.list).toStrictEqual(expectedList)
  })

  test('GET to /search_person  by uid', async () => {
    const serverResponse = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000006',
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Maria',
      middleName: null,
      lastName: 'Zankovetska',
      jobTitle: null,
      legalName: null,
      shortName: null,
      tagline: null,
      email: 'maria.zankovetska@iviche.com',
      phone: '+380440001122#6',
      birthdayAt: '1990-04-14T12:51:21.189Z',
      gender: 'FEMALE',
      socialStatus: 'CLERK',
      bio: null,
      addressRegion: 'LVIV_REGION',
      addressDistrict: null,
      addressTown: 'brody_city',
      addressLine1: null,
      addressLine2: null,
      addressZip: null,
      createdAt: '2019-11-27T13:43:30.212Z',
      deletedAt: null,
      avatar: null,
    }
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/search_person?uid=${regularUserData.uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(serverResponse)
    // // AND result must contain expected metadata and expected list data
    // expect(response.body.metadata).toStrictEqual(expectedMetadata)
    // expect(response.body.list).toStrictEqual(expectedList)
  })

  test('GET to /search_person  by email', async () => {
    const serverResponse = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000006',
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Maria',
      middleName: null,
      lastName: 'Zankovetska',
      jobTitle: null,
      legalName: null,
      shortName: null,
      tagline: null,
      email: 'maria.zankovetska@iviche.com',
      phone: '+380440001122#6',
      birthdayAt: '1990-04-14T12:51:21.189Z',
      gender: 'FEMALE',
      socialStatus: 'CLERK',
      bio: null,
      addressRegion: 'LVIV_REGION',
      addressDistrict: null,
      addressTown: 'brody_city',
      addressLine1: null,
      addressLine2: null,
      addressZip: null,
      createdAt: '2019-11-27T13:43:30.212Z',
      deletedAt: null,
      avatar: null,
    }
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/search_person?email=${regularUserData.username}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(serverResponse)
    // // AND result must contain expected metadata and expected list data
    // expect(response.body.metadata).toStrictEqual(expectedMetadata)
    // expect(response.body.list).toStrictEqual(expectedList)
  })

  test('GET to /user-profile/profiles/:email successfully with email', async () => {
    // GIVEN application, superuser credentials profile data
    const profileData = {
      person: {
        isLegalPerson: false,
        isPublicPerson: false,
        firstName: 'Pericles',
        middleName: null,
        lastName: 'Athenian',
        jobTitle: null,
        legalName: null,
        shortName: null,
        tagline: null,
        email: 'pericles@iviche.com',
        phone: '+380440001122#1',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z').toISOString(),
        gender: Gender.MALE,
        socialStatus: SocialStatus.CLERK,
        bio: null,
        addressRegion: Region.KYIV_CITY_REGION,
        addressDistrict: null,
        addressTown: 'kyiv_city',
        avatar: null,
      },
      user: {
        role: UserRole.ADMINISTRATOR,
        username: 'pericles@iviche.com',
        password: '',
        systemStatus: UserSystemStatus.ACTIVE,
      },
      details: {
        emailConfirmed: true,
        phoneConfirmed: true,
        notifyEmail: false,
        notifyTelegram: false,
        notifyViber: false,
        notifySMS: false,
        notifyAboutNewPoll: true,
        wpJournalistID: null,
        googleId: null,
        facebookId: null,
        appleId: null,
        language: Language.UA,
      },
    }

    // WHEN get to /user-profile/profiles is done
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/${profileData.user.username}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain profile data
    expect(response.body).toStrictEqual(profileData)
  })

  test('GET to /user-profile/profiles/:username successfully with email (facebook)', async () => {
    // GIVEN application, superuser credentials profile data
    const profileData = {
      person: {
        isLegalPerson: false,
        isPublicPerson: false,
        firstName: 'Vadym',
        middleName: null,
        lastName: 'Feoklistov',
        jobTitle: null,
        legalName: null,
        shortName: null,
        tagline: null,
        email: 'facebook.user@dewais.com',
        phone: '+380440001122#7',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z').toISOString(),
        gender: Gender.MALE,
        socialStatus: SocialStatus.CLERK,
        bio: null,
        addressRegion: Region.KHARKIV_REGION,
        addressDistrict: null,
        addressTown: 'kharkiv_city',
        avatar: null,
      },
      user: {
        role: UserRole.PRIVATE,
        username: '100004290272604@facebook',
        password: '',
        systemStatus: UserSystemStatus.ACTIVE,
      },
      details: {
        emailConfirmed: true,
        phoneConfirmed: true,
        notifyEmail: false,
        notifyTelegram: false,
        notifyViber: false,
        notifySMS: false,
        notifyAboutNewPoll: true,
        wpJournalistID: null,
        googleId: null,
        appleId: null,
        facebookId: '100004290272604',
        language: Language.UA,
      },
    }

    // WHEN get to /user-profile/profiles is done
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/${profileData.person.email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain profile data
    expect(response.body).toStrictEqual(profileData)
  })

  test('GET to /user-profile/profiles/:email successfully with email (google)', async () => {
    // GIVEN application, superuser credentials profile data
    const profileData = {
      person: {
        isLegalPerson: false,
        isPublicPerson: false,
        firstName: 'Bogdan',
        middleName: null,
        lastName: 'Moskin',
        jobTitle: null,
        legalName: null,
        shortName: null,
        tagline: null,
        email: 'google.user@dewais.com',
        phone: '+380440001122#8',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z').toISOString(),
        gender: Gender.MALE,
        socialStatus: SocialStatus.UNEMPLOYED,
        bio: null,
        addressRegion: Region.KHARKIV_REGION,
        addressDistrict: null,
        addressTown: 'kharkiv_city',
        avatar: null,
      },
      user: {
        role: UserRole.PRIVATE,
        username: googleUserData.username,
        password: '',
        systemStatus: UserSystemStatus.ACTIVE,
      },
      details: {
        emailConfirmed: true,
        phoneConfirmed: true,
        notifyEmail: false,
        notifyTelegram: false,
        notifyViber: false,
        notifySMS: false,
        notifyAboutNewPoll: true,
        wpJournalistID: null,
        googleId: '111111111111111',
        facebookId: null,
        appleId: null,
        language: Language.UA,
      },
    }

    // WHEN get to /user-profile/profiles is done
    const response = await request(TestContext.app)
      .get(`/user-profile/profiles/${profileData.person.email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain profile data
    expect(response.body).toStrictEqual(profileData)
  })

  test('PUT by PrimeAdmin to /user-profile/profiles/:username/avatar successfully with existing image uid', async () => {
    // GIVEN application, PrimeAdmin credentials and test avatar image
    // WHEN placing avatar image by request to /image is done
    const imagePutResponse = await request(TestContext.app)
      .post(`/images`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('name', './test/database/seeds/testAvatarImage.jpg')

    // THEN response must be successful with no content
    expect(imagePutResponse.status).toBe(200)
    // AND body should contain uuid of saved picture
    expect(imagePutResponse.body.uid).toHaveLength(36)

    // GIVEN application, PrimeAdmin credentials, uid of successfully saved image and default Journalist username for which we are try to change avatar
    // WHEN request to /user-profile/my-profile/:username/avatar is done by PrimeAdmin
    const avatarPutResponse = await request(TestContext.app)
      .put(`/user-profile/profiles/${journalistData.username}/avatar`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send({
        avatar: imagePutResponse.body.uid,
      })

    // THEN response must be successful with no content
    expect(avatarPutResponse.status).toBe(204)
    // AND body should be empty
    expect(avatarPutResponse.body).toStrictEqual({})

    // GIVEN application and default Journalist credentials
    // WHEN request to /user-profile/my-profile is done by default Journalist
    const profileGetResponse = await request(TestContext.app)
      .get(`/user-profile/my-profile`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be successful with no content
    expect(profileGetResponse.status).toBe(200)
    // AND avatar uuid should be exact as we put
    expect(profileGetResponse.body.person.avatar).toStrictEqual(imagePutResponse.body.uid)
  })

  test('POST to /user-profile/profiles successfully', async () => {
    // GIVEN application, administrator credentials and profile data
    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app)
      .post('/user-profile/profiles')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send({
        username: 'person#@iveche.com',
        password: 'Dewais123!',
        isLegalPerson: false,
        isPublicPerson: true,
        firstName: 'firstname of person#5',
        lastName: 'lastname of person#5',
        email: 'person#@iveche.com',
        role: UserRole.JOURNALIST,
        phone: '+380440001122#5',
        notifyEmail: true,
        notifySMS: true,
        notifyTelegram: true,
        notifyViber: true,
      })

    // THEN response must be successful
    expect(response.status).toBe(201)
  })

  test('PUT to /user-profile/profiles/:username/person successfully with email username ', async () => {
    // GIVEN Username (email)
    const username = 'mykhailo.hrushevsky@iviche.com'

    // AND application, superuser credentials and a person data to be updated
    const personData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Firstname for PUT Person test',
      lastName: 'Lastname for PUT Person test',
      email: 'mykhailo.hrushevsky@iviche.com',
      socialStatus: SocialStatus.CLERK,
    }

    // WHEN request to /user-profile/profiles/:username/person is done
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${username}/person`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(personData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('PUT to /user-profile/profiles/:username/person successfully with username (facebook id)', async () => {
    // GIVEN Username
    const username = '100004290272604@facebook'

    // AND application, superuser credentials and a person data to be updated
    const personData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Firstname for PUT Person test',
      lastName: 'Lastname for PUT Person test',
      socialStatus: SocialStatus.UNEMPLOYED,
    }

    // WHEN request to /user-profile/profiles/:username/person is done
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${username}/person`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(personData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('PUT to /user-profile/profiles/:username/user-details successfully', async () => {
    // GIVEN application, superuser credentials and a user-details data to be updated
    const detailsData: UserDetails = {
      notifyEmail: true,
      notifySMS: true,
      linkGoogle: 'blabla.com',
    }

    // WHEN request to /user-profile/profiles/:username/user-details is done
    const response = await request(TestContext.app)
      .put('/user-profile/profiles/lesya.ukrainka@iviche.com/user-details')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(detailsData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})
  })

  test('DELETE to /user-profile/profiles/:username successfully', async () => {
    // GIVEN application and public user data
    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app)
      .delete(`/user-profile/profiles/${regularUserData.username}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
    // THEN response must be successful
    expect(response.status).toBe(204)
  })

  test('PUT to /:username/password successfully', async () => {
    // GIVEN application and new password and superuser data
    const newPassword = 'New_pass1'

    // WHEN request is done to /user-profile/profiles/:username/password address
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${regularUserData.username}/password`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send({ password: primeAdminData.password, newPassword })

    // THEN response must be successful
    expect(response.status).toBe(202)
  })

  test('PUT to /:username/email successfully. Administrator changes the data of another user', async () => {
    // GIVEN new email/username
    const newEmail = 'newTestEmail@iviche.com'

    // WHEN request is done to /user-profile/profiles/:username/email address
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${usersList[0].username}/email`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send({ password: primeAdminData.password, email: newEmail })

    // THEN response must be successful
    expect(response.status).toBe(202)

    const knex = container.resolve<Knex>('DBConnection')
    const check = await knex<User>('users')
      .select('*')
      .where({ username: newEmail })
      .first()

    expect(check?.uid).toBe(usersList[0].uid)
  })

  test(`PUT to /unlink-facebook/:email successfully. Administrator unlink user's facebook`, async () => {
    // GIVEN email of user
    const email = personsList[5].email
    // AND dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQuery = knex<UserDetails>('user_details')
      .select('user_details.*')
      .leftJoin('users', 'users.uid', 'user_details.uid')
      .leftJoin('person', 'person.uid', 'users.personUID')
      .where('person.email', email)
      .first()
    // AND userDetails object must contain facebookId
    const userDetailsBefore = await checkQuery
    expect(userDetailsBefore.facebookId).toBeDefined()

    // WHEN request is done to /user-profile/profiles/unlink-facebook/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-facebook/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(204)
    // AND facebookId must be null
    const userDetailsAfter = await checkQuery
    expect(userDetailsAfter.facebookId).toBeNull()
  })

  test(`PUT to /unlink-google/:email successfully. Administrator unlink user's google`, async () => {
    // GIVEN email of user
    const email = personsList[5].email
    // AND dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQuery = knex<UserDetails>('user_details')
      .select('user_details.*')
      .leftJoin('users', 'users.uid', 'user_details.uid')
      .leftJoin('person', 'person.uid', 'users.personUID')
      .where('person.email', email)
      .first()
    // AND userDetails object must contain googleId
    const userDetailsBefore = await checkQuery
    expect(userDetailsBefore.googleId).toBeDefined()

    // WHEN request is done to /user-profile/profiles/unlink-google/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-google/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(204)
    // AND googleId must be null
    const userDetailsAfter = await checkQuery
    expect(userDetailsAfter.googleId).toBeNull()
  })

  test(`PUT to /unlink-apple/:email successfully. Administrator unlink user's apple`, async () => {
    // GIVEN email of user
    const email = personsList[5].email
    // AND dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQuery = knex<UserDetails>('user_details')
      .select('user_details.*')
      .leftJoin('users', 'users.uid', 'user_details.uid')
      .leftJoin('person', 'person.uid', 'users.personUID')
      .where('person.email', email)
      .first()
    // AND userDetails object must contain appleId
    const userDetailsBefore = await checkQuery
    expect(userDetailsBefore.appleId).toBeDefined()

    // WHEN request is done to /user-profile/profiles/unlink-apple/:email
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/unlink-apple/${email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(204)
    // AND appleId must be null
    const userDetailsAfter = await checkQuery
    expect(userDetailsAfter.appleId).toBeNull()
  })

  test(`PUT to /user-language successfully.`, async () => {
    // GIVEN username of user
    const username = primeAdminData.username
    // AND dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQuery = knex<UserDetails>('user_details')
      .whereIn(
        'uid',
        knex('users')
          .select('uid')
          .where('username', username)
          .first(),
      )
      .first()
    // AND userDetails object must contain language UA
    const userDetailsBefore = await checkQuery
    expect(userDetailsBefore?.language).toBe(Language.UA)

    // WHEN request is done to /user-profile/my-profile/user-language/:language
    const response = await request(TestContext.app)
      .put(`/user-profile/my-profile/user-language/${Language.RU}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(204)
    // AND Language must be RU
    const userDetailsAfter = await checkQuery
    expect(userDetailsAfter?.language).toBe(Language.RU)
  })

  test(`PUT by Admin to /:userId/ban successfully.`, async () => {
    // GIVEN userid of regular user
    const userId = regularUserData.uid

    // WHEN request is done to /user-profile/profiles/:userId/ban
    const changeSystemStatusResponse = await request(TestContext.app)
      .put(`/user-profile/profiles/${userId}/ban`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send({
        systemStatus: UserSystemStatus.BANNED,
      })

    // THEN dbConnection with special query
    const knex = container.resolve<Knex>('DBConnection')
    const checkQueryAfterRequest = knex<User>('users')
      .select('systemStatus')
      .where('uid', userId)
      .first()

    // AND userSystemStatus must be BANNED
    const userSystemStatusAfterRequest = await checkQueryAfterRequest
    expect(userSystemStatusAfterRequest?.systemStatus).toBe(UserSystemStatus.BANNED)

    // THEN response must be successful
    expect(changeSystemStatusResponse.status).toBe(204)
    // AND body should be empty
    expect(changeSystemStatusResponse.body).toStrictEqual({})
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
