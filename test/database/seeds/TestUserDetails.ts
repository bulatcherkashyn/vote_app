import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Person } from '../../../src/iviche/person/model/Person'
import { AuthServiceImpl } from '../../../src/iviche/security/auth/services/AuthServiceImpl'
import { User } from '../../../src/iviche/users/models/User'
import { UserDetails } from '../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../src/iviche/users/models/UserSystemStatus'
import { createRandomString } from '../../unit/common/TestUtilities'

export const personsList: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000011',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'MY',
    lastName: 'NAME',
    email: 'sometestDUDE@iviche.com',
    phone: '+380440001122#11',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000012',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Stas',
    lastName: 'Sinotov',
    email: 'setNewPasswordUser@iviche.com',
    phone: '+380440001123#12',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000013',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'User with',
    lastName: 'Expired passwordRestorationCode',
    email: 'expiredRestorationCode@iviche.com',
    phone: '+380440001124#13',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000014',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'phoneConfirmed',
    lastName: 'false',
    email: 'phoneConfirmedIsFalsyWiCode@iviche.com',
    phone: '+380440001124#14',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000015',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'emptyPhone',
    lastName: 'likeFirstLogin',
    email: 'emptyPhoneLikeFirstLogin@iviche.com',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000016',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'unlink',
    lastName: 'Social',
    email: 'unlinkSocialBoy@iviche.com',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
]

export const usersList: Array<User> = [
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000001',
    username: 'sometestDUDE@iviche.com',
    password: AuthServiceImpl.encryptPassword('ARrr'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000011',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000002',
    username: 'setNewPasswordUser@iviche.com',
    password: AuthServiceImpl.encryptPassword('old boring password'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000012',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000003',
    username: 'expiredRestorationCode@iviche.com',
    password: AuthServiceImpl.encryptPassword('Passwordik1'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000013',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000004',
    username: 'phoneConfirmedIsFalsyWiCode@iviche.com',
    password: AuthServiceImpl.encryptPassword('PasswordForPhoneConfiramtion'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000014',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000005',
    username: 'emptyPhoneLikeFirstLogin@iviche.com',
    password: AuthServiceImpl.encryptPassword('PasswordForFirstPhoneChanging'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000015',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000006',
    username: 'unlinkSocialBoy@iviche.com',
    password: AuthServiceImpl.encryptPassword('unlinkBoiPassword'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000016',
    systemStatus: UserSystemStatus.SUSPENDED,
  },
]

export const userDetailsList: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000001',
    emailConfirmationCodeCreatedAt: DateUtility.fromISO('2000-01-01T00:00:00.000Z'),
    emailConfirmationCode: 'qqqqqqqqq1',
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000002',
    passwordRestorationCode: createRandomString(128),
    passwordRestorationCodeCreatedAt: DateUtility.now(),
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000003',
    passwordRestorationCode: createRandomString(128),
    passwordRestorationCodeCreatedAt: DateUtility.subtractDays(1),
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000004',
    passwordRestorationCode: createRandomString(128),
    passwordRestorationCodeCreatedAt: DateUtility.subtractDays(1),
    phoneConfirmationCode: 123123,
    phoneConfirmationCodeCreatedAt: DateUtility.now(),
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000005',
  },
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000006',
    facebookId: '11111111111',
    googleId: '111111111111',
    appleId: '111111111111111',
  },
]

export async function userDetailsSeed(knex: Knex): Promise<void> {
  await knex('person').insert(personsList)
  await knex('users').insert(usersList)
  await knex('user_details').insert(userDetailsList)
}
