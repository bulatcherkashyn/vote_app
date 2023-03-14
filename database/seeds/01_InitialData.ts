import * as Knex from 'knex'

import { Gender } from '../../src/iviche/common/Gender'
import { Region } from '../../src/iviche/common/Region'
import { SocialStatus } from '../../src/iviche/common/SocialStatus'
import { UserRole } from '../../src/iviche/common/UserRole'
import { DateUtility } from '../../src/iviche/common/utils/DateUtility'
import { Person } from '../../src/iviche/person/model/Person'
import { AuthServiceImpl } from '../../src/iviche/security/auth/services/AuthServiceImpl'
import { User } from '../../src/iviche/users/models/User'
import { UserDetails } from '../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../src/iviche/users/models/UserSystemStatus'

export const initialPersonData: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000001',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Pericles',
    lastName: 'Athenian',
    email: 'pericles@iviche.com',
    birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
    phone: '+380634479601',
    gender: Gender.MALE,
    socialStatus: SocialStatus.UNEMPLOYED,
    addressRegion: Region.KHARKIV_REGION,
    addressTown: 'kharkiv_city',
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000002',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Ivan',
    lastName: 'Mazepa',
    email: 'ivan.mazepa@iviche.com',
    birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
    phone: '+380440001122#2',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    addressRegion: Region.KHARKIV_REGION,
    addressTown: 'kharkiv_city',
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000003',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Lesya',
    lastName: 'Ukrainka',
    email: 'lesya.ukrainka@iviche.com',
    birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
    phone: '+380440001122#3',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.MANAGER,
    addressRegion: Region.KHARKIV_REGION,
    addressTown: 'kharkiv_city',
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
]

export const initialUserData: Array<User> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000001',
    username: 'pericles@iviche.com',
    password: AuthServiceImpl.encryptPassword('Superuserpwd1!'),
    role: UserRole.ADMINISTRATOR,
    personUID: initialPersonData[0].uid,
    systemStatus: UserSystemStatus.ACTIVE,
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000002',
    username: 'ivan.mazepa@iviche.com',
    password: AuthServiceImpl.encryptPassword('Userpwd1!'),
    role: UserRole.PRIVATE,
    personUID: initialPersonData[1].uid,
    systemStatus: UserSystemStatus.ACTIVE,
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000003',
    username: 'lesya.ukrainka@iviche.com',
    password: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
    role: UserRole.JOURNALIST,
    personUID: initialPersonData[2].uid,
    systemStatus: UserSystemStatus.ACTIVE,
    createdAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
]

export const initialUserDetailsData: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000001',
    emailConfirmed: true,
    phoneConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000002',
    emailConfirmed: true,
    phoneConfirmed: true,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000003',
    emailConfirmed: true,
    phoneConfirmed: true,
    wpJournalistID: 1,
  },
]

export async function seed(knex: Knex): Promise<void> {
  await knex('person').insert(initialPersonData)

  await knex('users').insert(initialUserData)

  await knex('user_details').insert(initialUserDetailsData)
}
