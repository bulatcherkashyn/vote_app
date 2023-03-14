import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Moderation } from '../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationType } from '../../../src/iviche/moderation/model/ModerationType'
import { Person } from '../../../src/iviche/person/model/Person'
import { User } from '../../../src/iviche/users/models/User'
import { UserDetails } from '../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../src/iviche/users/models/UserSystemStatus'
import { usersList } from './01_InitialData'
import { testPollsList } from './TestPollsList'
import { testPollAnswer } from './TestPollsListModeration'

export const moderationPersonsList: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbcc-000000000001',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Test',
    lastName: 'Moderation',
    email: 'testModeration@iviche.com',
    phone: '+380440001199#1',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    addressRegion: Region.KYIV_CITY_REGION,
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbcc-000000000002',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Test',
    lastName: 'Moderation2',
    email: 'testModeration2@iviche.com',
    phone: '+380440001199#1',
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    addressRegion: Region.KYIV_CITY_REGION,
    addressDistrict: 'some district',
    birthdayAt: DateUtility.fromISO('2000-11-27T13:43:30.212Z'),
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
]

export const moderationUsersList: Array<User> = [
  {
    uid: '00000000-aaaa-aaaa-bccc-000000000001',
    username: 'moderationTestUser',
    password: 'testPassword1!',
    role: UserRole.PRIVATE,
    systemStatus: UserSystemStatus.ACTIVE,
    personUID: moderationPersonsList[0].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-bccc-000000000002',
    username: 'moderationTestUser2',
    password: 'testPassword1!',
    role: UserRole.PRIVATE,
    systemStatus: UserSystemStatus.ACTIVE,
    personUID: moderationPersonsList[1].uid,
  },
]

export const moderationDetailsList: Array<UserDetails> = [
  {
    uid: moderationUsersList[0].uid,
    emailConfirmationCodeCreatedAt: DateUtility.fromISO('2000-01-01T00:00:00.000Z'),
  },
  {
    uid: moderationUsersList[1].uid,
    phoneConfirmed: true,
    emailConfirmed: true,
    emailConfirmationCodeCreatedAt: DateUtility.fromISO('2000-01-01T00:00:00.000Z'),
  },
]

export const testModerationArray: Array<Moderation> = [
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000001',
    reference: testPollsList[1].uid,
    resolution: ModerationResolutionType.PENDING,
    type: ModerationType.POLL,
    concern: 'test',
    summary: 'poll header 1',
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000002',
    reference: moderationUsersList[0].uid || '',
    resolution: ModerationResolutionType.PENDING,
    type: ModerationType.USER,
    concern: 'test2',
    summary: 'user registration',
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000003',
    reference: moderationUsersList[1].uid || '',
    resolution: ModerationResolutionType.PENDING,
    type: ModerationType.USER,
    concern: 'test2',
    summary: 'user registration',
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000004',
    reference: testPollAnswer[10].uid as string,
    resolution: ModerationResolutionType.PENDING,
    type: ModerationType.POLL_ANSWER,
    concern: 'test',
    summary: testPollAnswer[10].title,
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000005',
    reference: testPollAnswer[13].uid as string,
    resolution: ModerationResolutionType.REJECTED,
    type: ModerationType.POLL_ANSWER,
    concern: 'test',
    summary: testPollAnswer[13].title,
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
]

export async function testModerationSeed(knex: Knex): Promise<void> {
  await knex('person').insert(moderationPersonsList)
  await knex('users').insert(moderationUsersList)
  await knex('user_details').insert(moderationDetailsList)
  await knex('moderation_case').insert(testModerationArray)
}
