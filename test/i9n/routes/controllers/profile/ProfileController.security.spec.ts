import 'reflect-metadata'

import * as HttpStatus from 'http-status-codes'
import request from 'supertest'

import {
  administratorData,
  journalistData,
  moderatorData,
  publicUserData,
  regularUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import CustomMatcherResult = jest.CustomMatcherResult
import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../../src/iviche/common/UserRole'
import { SecurityVerificationConfiguration } from '../../../common/SecurityVerificationConfiguration'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn()
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

const securityVerificationConfiguration: SecurityVerificationConfiguration = {
  administrator: {
    token: administratorData.jwtToken,
    requests: {
      list: {
        expectedStatus: HttpStatus.OK,
      },
      post: {
        expectedStatus: HttpStatus.CREATED,
      },
      loadOwn: {
        expectedStatus: HttpStatus.OK,
        params: [administratorData.username],
      },
      load: {
        expectedStatus: HttpStatus.OK,
        params: [regularUserData.username],
      },
      putOwn: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [administratorData.username],
      },
      put: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [regularUserData.username],
      },
      deleteOwn: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [administratorData.username],
      },
      delete: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [],
      },
    },
  },
  moderator: {
    token: moderatorData.jwtToken,
    requests: {
      list: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      post: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      loadOwn: {
        expectedStatus: HttpStatus.OK,
        params: [moderatorData.username],
      },
      load: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [regularUserData.username],
      },
      putOwn: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [moderatorData.username],
      },
      put: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [regularUserData.username],
      },
      deleteOwn: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [moderatorData.username],
      },
      delete: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [],
      },
    },
  },
  journalist: {
    token: journalistData.jwtToken,
    requests: {
      list: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      post: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      loadOwn: {
        expectedStatus: HttpStatus.OK,
        params: [journalistData.username],
      },
      load: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [regularUserData.username],
      },
      putOwn: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [journalistData.username],
      },
      put: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [regularUserData.username],
      },
      deleteOwn: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [journalistData.username],
      },
      delete: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [],
      },
    },
  },
  user: {
    token: regularUserData.jwtToken,
    requests: {
      list: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      post: {
        expectedStatus: HttpStatus.FORBIDDEN,
      },
      loadOwn: {
        expectedStatus: HttpStatus.OK,
        params: [regularUserData.username],
      },
      load: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [publicUserData.username],
      },
      putOwn: {
        expectedStatus: HttpStatus.NO_CONTENT,
        params: [regularUserData.username],
      },
      put: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [publicUserData.username],
      },
      deleteOwn: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [regularUserData.username],
      },
      delete: {
        expectedStatus: HttpStatus.FORBIDDEN,
        params: [],
      },
    },
  },
}

expect.extend({
  toBeStatusForUser: (
    received: number,
    expected: number,
    username: string,
  ): CustomMatcherResult => {
    if (received !== expected) {
      return {
        message: (): string =>
          `Expected HTTP status [${expected}], but received [${received}] for user [${username}]`,
        pass: false,
      }
    } else {
      return {
        message: (): string =>
          `Expected HTTP status not to be [${expected}] for user [${username}]`,
        pass: true,
      }
    }
  },
})

describe('ProfileController with special credentials', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('GET list profiles', async () => {
    // GIVEN application and credentials of different users
    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]

      // WHEN request is done to /user-profile address
      const response = await request(TestContext.app)
        .get('/user-profile/profiles')
        .set('Cookie', [`token=${testConfig.token}`])
      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.list.expectedStatus, user)
    }
  })

  test('POST new profile', async () => {
    // GIVEN application, profile data and credentials of different users
    const profileData = {
      addressDistrict: 'test1',
      addressRegion: Region.KYIV_CITY_REGION,
      addressTown: 'test1',
      username: 'testcreate@test.com',
      password: 'Dewais123!',
      bio: 'test1',
      birthdayAt: new Date('01.06.2000').toISOString(),
      email: 'testcreate@test.com',
      firstName: 'test1',
      middleName: 'test1',
      lastName: 'test1',
      jobTitle: 'test1',
      phone: '+380963332211',
      socialStatus: SocialStatus.UNEMPLOYED,
      gender: Gender.MALE,
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
      role: UserRole.LEGAL,
    }

    let i = 1
    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      profileData.username = `testcreate${i++}@test.com`
      profileData.email = profileData.username

      // WHEN create request is done to /user-profile/profiles address with new user data
      const response = await request(TestContext.app)
        .post('/user-profile/profiles')
        .set('Cookie', [`token=${testConfig.token}`])
        .send({
          ...profileData,
          username: user + profileData.username,
          email: user + profileData.email,
        })

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.post.expectedStatus, user)
    }
  })

  test('GET my-profile', async () => {
    // GIVEN application and credentials of different users
    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      // WHEN user requests own profile data
      const response = await request(TestContext.app)
        .get(`/user-profile/my-profile`)
        .set('Cookie', [`token=${testConfig.token}`])

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.loadOwn.expectedStatus, user)
    }
  })

  test('GET other profile', async () => {
    // GIVEN application and credentials of different users
    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      // WHEN user requests other profile's data
      const response = await request(TestContext.app)
        .get(`/user-profile/profiles/${testConfig.requests.load.params[0]}`)
        .set('Cookie', [`token=${testConfig.token}`])

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.load.expectedStatus, user)
    }
  })

  test('PUT my-profile', async () => {
    // GIVEN application, profile data and credentials of different users
    const profileData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Firstname of person for PUT test',
      lastName: 'Lastname of person for PUT test',
      socialStatus: SocialStatus.UNEMPLOYED,
    }

    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      // WHEN update request is done for own profile
      const response = await request(TestContext.app)
        .put(`/user-profile/my-profile/person`)
        .set('Cookie', [`token=${testConfig.token}`])
        .send(profileData)

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.putOwn.expectedStatus, user)
    }
  })

  test('PUT other profile', async () => {
    // GIVEN application, profile data and credentials of different users
    const personData = {
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'new name',
      lastName: 'new lastname',
      phone: '+380440001122#1000',
      gender: Gender.UNSET,
      socialStatus: SocialStatus.UNEMPLOYED,
    }

    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      // WHEN update request is done for other person
      const response = await request(TestContext.app)
        .put(`/user-profile/profiles/${testConfig.requests.put.params[0]}/person`)
        .set('Cookie', [`token=${testConfig.token}`])
        .send(personData)

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.put.expectedStatus, user)
    }
  })

  test('DELETE other profile', async () => {
    // GIVEN application, profile stub and credentials of different users
    const profileData = {
      username: '12311@test.com',
      password: 'Dewais123!',
      bio: 'test1',
      birthdayAt: new Date('01.01.1900 GMT+00:00'),
      email: `12311@test.com`,
      firstName: 'test1',
      middleName: 'test1',
      lastName: 'test1',
      phone: '+380963332211',
      role: UserRole.LEGAL,
      socialStatus: SocialStatus.UNEMPLOYED,
      gender: Gender.MALE,
      isLegalPerson: false,
      isPublicPerson: false,
      systemStatus: '',
      phoneConfirmed: false,
    }

    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]

      // AND profile object, ready to be deleted
      const createResponse = await request(TestContext.app)
        .post('/user-profile/profiles')
        .set('Cookie', [`token=${administratorData.jwtToken}`])
        .send({
          ...profileData,
          username: user + profileData.username,
          email: user + profileData.email,
        })
      // AND here we have health check to make sure that a profile has been created
      expect(createResponse.status).toBe(HttpStatus.CREATED)

      // WHEN delete request is done for other profile data
      const response = await request(TestContext.app)
        .delete(`/user-profile/profiles/${user + profileData.username}`)
        .set('Cookie', [`token=${testConfig.token}`])

      // THEN response status must be by configuration
      expect(response.status).toBeStatusForUser(testConfig.requests.delete.expectedStatus, user)
    }
  })

  test('DELETE my-profile', async () => {
    // GIVEN application and credentials of different users
    for (const user in securityVerificationConfiguration) {
      const testConfig = securityVerificationConfiguration[user]
      // WHEN delete request is done for own profile data
      const response = await request(TestContext.app)
        .delete(`/user-profile/my-profile/`)
        .set('Cookie', [`token=${testConfig.token}`])

      // THEN response status must be method not allowed
      expect(response.status).toBeStatusForUser(testConfig.requests.deleteOwn.expectedStatus, user)
    }
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
