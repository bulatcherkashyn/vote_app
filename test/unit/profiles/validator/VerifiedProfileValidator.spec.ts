import 'reflect-metadata'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { getSystemStatus } from '../../../../src/iviche/profiles/validator/VerifiedProfileValidator'
import { UserSystemStatus } from '../../../../src/iviche/users/models/UserSystemStatus'

describe('Verified profile validator. Success', () => {
  test('create suspended private person', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: '',
        lastName: '',
        gender: Gender.UNSET,
        socialStatus: SocialStatus.UNKNOWN,
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: false,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has SUSPENDED system status
    expect(res).toEqual(UserSystemStatus.SUSPENDED)
  })

  test('create limited private person', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.PRIVATE },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
        gender: Gender.UNSET,
        socialStatus: SocialStatus.UNKNOWN,
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status
    expect(res).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active private person', async () => {
    // GIVEN correct profile data for validator
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
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
        phoneConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has ACTIVE system status
    expect(res).toEqual(UserSystemStatus.ACTIVE)
  })

  test('create suspended legal person', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.LEGAL },
      person: {
        isLegalPerson: true,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        legalName: '',
        shortName: '',
        tagline: '',
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: false,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has SUSPENDED system status
    expect(res).toEqual(UserSystemStatus.SUSPENDED)
  })

  test('create limited legal person', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.LEGAL },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        legalName: 'TestLegalName',
        shortName: 'TestShortName',
        tagline: '',
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has LIMITED system status
    expect(res).toEqual(UserSystemStatus.LIMITED)
  })

  test('create active legal person', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: '', role: UserRole.LEGAL },
      person: {
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
        legalName: 'TestLegalName',
        shortName: 'TestShortName',
        tagline: 'TestTagline',
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
        birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
      },
      details: {
        emailConfirmed: true,
        phoneConfirmed: true,
      },
    }

    // WHEN call getSystemStatus method
    const res = getSystemStatus(prof)

    // THEN PRIVATE person has ACTIVE system status
    expect(res).toEqual(UserSystemStatus.ACTIVE)
  })
})
