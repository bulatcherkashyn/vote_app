import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Person } from '../../../src/iviche/person/model/Person'
import { AuthServiceImpl } from '../../../src/iviche/security/auth/services/AuthServiceImpl'
import { User } from '../../../src/iviche/users/models/User'
import { UserDetails } from '../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../src/iviche/users/models/UserSystemStatus'

export const personsList: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000020',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Need',
    lastName: 'Water',
    email: 'ochen.zharko@iviche.com',
    phone: '+380440001122#1',
    gender: Gender.MALE,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
]

export const usersList: Array<User> = [
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000020',
    username: 'ochen.zharko@iviche.com',
    password: AuthServiceImpl.encryptPassword('CorrectPassword1'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000000020',
    systemStatus: UserSystemStatus.ACTIVE,
  },
]

export const userDetailsList: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaab-aaaa-000000000020',
    facebookId: '123123123123123123',
    googleId: '456456456456456456',
    appleId: '789789789789789789',
  },
]

export async function socialProfilesSeed(knex: Knex): Promise<void> {
  await knex('person').insert(personsList)
  await knex('users').insert(usersList)
  await knex('user_details').insert(userDetailsList)
}
