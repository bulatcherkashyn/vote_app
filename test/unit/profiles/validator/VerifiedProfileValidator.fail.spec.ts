import 'reflect-metadata'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { getSystemStatus } from '../../../../src/iviche/profiles/validator/VerifiedProfileValidator'
import { UserSystemStatus } from '../../../../src/iviche/users/models/UserSystemStatus'

describe('Verified profile validator. Fail', () => {
  test('create active private person. Fail. With gender [UNSET]', async () => {
    // GIVEN profile data with UNSER gender
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.UNSET,
        socialStatus: SocialStatus.WORKER,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const status = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status (not ACTIVE)
    expect(status).not.toEqual(UserSystemStatus.ACTIVE)
    expect(status).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active private person. Fail. With socialStatus [UNKNOWN]', async () => {
    // GIVEN profile data with UNKNOWN socialStatus
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.MALE,
        socialStatus: SocialStatus.UNKNOWN,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const status = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status (not ACTIVE)
    expect(status).not.toEqual(UserSystemStatus.ACTIVE)
    expect(status).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active private person. Fail. With addressRegion [UNKNOWN]', async () => {
    // GIVEN profile data with UNKNOWN addressRegion
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.MALE,
        socialStatus: SocialStatus.WORKER,
        addressRegion: Region.UNKNOWN,
        addressDistrict: 'baryshivskyi_district',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const status = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status (not ACTIVE)
    expect(status).not.toEqual(UserSystemStatus.ACTIVE)
    expect(status).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active private person. Fail. With empty addressDistrict', async () => {
    // GIVEN profile data with empty addressDistrict
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.MALE,
        socialStatus: SocialStatus.WORKER,
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const status = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status (not ACTIVE)
    expect(status).not.toEqual(UserSystemStatus.ACTIVE)
    expect(status).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active private person. Fail. With empty addressTown', async () => {
    // GIVEN profile data with empty addressTown
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.MALE,
        socialStatus: SocialStatus.WORKER,
        addressRegion: Region.UNKNOWN,
        addressTown: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const status = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status (not ACTIVE)
    expect(status).not.toEqual(UserSystemStatus.ACTIVE)
    expect(status).toEqual(UserSystemStatus.LIMITED)
  })
})
