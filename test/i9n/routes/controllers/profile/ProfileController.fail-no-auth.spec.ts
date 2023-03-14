import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../../src/iviche/common/UserRole'
import { UserDetails } from '../../../../../src/iviche/users/models/UserDetails'
import { TestContext } from '../../../context/TestContext'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')

// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('PersonController fail, no auth token', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  beforeEach(() => {
    // NOTE: for future tests with nodemailer
    sendMailMock.mockClear()
    nodemailer.createTransport.mockClear()
  })

  test('GET to /user-profile/profiles', async () => {
    // GIVEN application
    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app).get('/user-profile/profiles')

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('GET to /user-profile/profiles/:email', async () => {
    // GIVEN application,profile data
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
        birthdayAt: null,
        gender: Gender.MALE,
        socialStatus: SocialStatus.UNEMPLOYED,
        bio: null,
        addressRegion: Region.UNKNOWN,
        addressDistrict: null,
        addressTown: null,
      },
      user: {
        role: UserRole.ADMINISTRATOR,
        username: 'pericles@iviche.com',
        password: '',
      },
      details: {
        systemStatus: null,
        emailConfirmationCodeCreatedAt: '2000-01-01T00:00:00.000Z',
        emailConfirmed: false,
        phoneConfirmed: false,
        notifyEmail: false,
        notifyTelegram: false,
        notifyViber: false,
        notifySMS: false,
      },
    }

    // WHEN get to /user-profile/profiles is done
    const response = await request(TestContext.app).get(
      `/user-profile/profiles/${profileData.person.email}`,
    )

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('POST to /user-profile/profiles', async () => {
    // GIVEN application, profile data
    // WHEN request is done to /user-profile/profiles address
    const response = await request(TestContext.app)
      .post('/user-profile/profiles')
      .send({
        addressDistrict: 'test1',
        addressRegion: Region.KYIV_CITY_REGION,
        addressTown: 'test1',
        password: 'Dewais123!',
        bio: 'test1',
        birthdayAt: '01.01.1900 GMT+00:00',
        email: 'testcreate@gmail.com',
        firstName: 'test1',
        middleName: 'test1',
        lastName: 'test1',
        jobTitle: 'test1',
        shortName: 'test1',
        legalName: 'test1',
        phone: '+380963332211',
        socialStatus: SocialStatus.UNEMPLOYED,
        gender: Gender.MALE,
        tagline: 'test1',
        isLegalPerson: false,
        isPublicPerson: false,
        systemStatus: '',
        emailConfirmed: false,
        emailConfirmationCodeCreatedAt: '01.01.2000 GMT+00:00',
        notifyEmail: false,
        notifySMS: false,
        notifyTelegram: false,
        notifyViber: false,
        phoneConfirmed: false,
        role: UserRole.PRIVATE,
      })

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('PUT to /user-profile/profiles/:username/person', async () => {
    // GIVEN application,person data to update
    const personData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Firstname of person for PUT test',
      lastName: 'Lastname of person for PUT test',
      email: 'lesya.ukrainka@iviche.com',
      socialStatus: SocialStatus.UNEMPLOYED,
    }

    // WHEN request to /user-profile/profiles/:username/person is done
    const response = await request(TestContext.app)
      .put(`/user-profile/profiles/${personData.email}/person`)
      .send(personData)
    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('PUT to /user-profile/profiles/:username/user-details', async () => {
    // GIVEN application, userDetails data to be update
    const detailsData: UserDetails = {
      notifyEmail: true,
      notifySMS: true,
      linkGoogle: 'blabla.com',
    }

    // WHEN request to /user-profile/profiles/:username/user-details is done
    const response = await request(TestContext.app)
      .put('/user-profile/profiles/lesya.ukrainka@iviche.com/user-details')
      .send(detailsData)

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
