import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../src/iviche/common/Theme'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Person } from '../../../src/iviche/person/model/Person'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { AuthData } from '../../../src/iviche/security/auth/models/AuthData'
import { AuthServiceImpl } from '../../../src/iviche/security/auth/services/AuthServiceImpl'
import { User } from '../../../src/iviche/users/models/User'
import { UserDetails } from '../../../src/iviche/users/models/UserDetails'
import { UserSystemStatus } from '../../../src/iviche/users/models/UserSystemStatus'
import { regularUserData } from '../../i9n/common/TestUtilities'

export const personsList: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000002077',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Johnny',
    lastName: 'Silversalo',
    email: 'ua.cyborg@iviche.com',
    phone: '+380440001122#2077',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
    addressRegion: Region.KHARKIV_REGION,
    addressTown: 'kharkiv_city',
    birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000002078',
    isLegalPerson: false,
    isPublicPerson: false,
    firstName: 'Just',
    lastName: 'Vi',
    email: 'vi@iviche.com',
    phone: '+380440001122#2078',
    gender: Gender.MALE,
    socialStatus: SocialStatus.SELFEMPLOYED,
    addressRegion: Region.KHARKIV_REGION,
    addressTown: 'kharkiv_city',
    birthdayAt: DateUtility.fromISO('1990-04-14T12:51:21.189Z'),
    createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
  },
]

export const usersList: Array<User> = [
  {
    uid: '00000000-aaaa-aaab-abcd-000000000001',
    username: 'ua.cyborg@iviche.com',
    password: AuthServiceImpl.encryptPassword('UACyborg'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000002077',
    systemStatus: UserSystemStatus.ACTIVE,
  },
  {
    uid: '00000000-aaaa-aaab-abcd-000000000002',
    username: 'vi@iviche.com',
    password: AuthServiceImpl.encryptPassword('missJack'),
    role: UserRole.PRIVATE,
    personUID: '00000000-aaaa-aaaa-bbbb-000000002078',
    systemStatus: UserSystemStatus.ACTIVE,
  },
]

export const userDetailsList: Array<UserDetails> = [
  {
    uid: '00000000-aaaa-aaab-abcd-000000000001',
    emailConfirmationCodeCreatedAt: DateUtility.fromISO('2000-01-01T00:00:00.000Z'),
    emailConfirmationCode: 'qqqqqqqqq1',
    phoneConfirmationCode: 123123,
    phoneConfirmationCodeCreatedAt: DateUtility.now(),
    notifyAboutNewPoll: true,
  },
  {
    uid: '00000000-aaaa-aaab-abcd-000000000002',
    emailConfirmationCodeCreatedAt: DateUtility.fromISO('2000-01-01T00:00:00.000Z'),
    emailConfirmationCode: 'qqqqqqqqq1',
    phoneConfirmationCode: 123123,
    phoneConfirmationCodeCreatedAt: DateUtility.now(),
    notifyAboutNewPoll: true,
  },
]

export const authDataList: Array<AuthData & { deviceToken: string }> = [
  {
    uid: usersList[0].uid,
    username: usersList[0].username,
    headerInfo: {
      ip: '167.168.1.1',
      userAgent: { ua: 'first-user-agent-string ' } as IUAParser.IResult,
    },
    refreshTokenHash: 'somehash2077',
    firebaseDeviceToken: 'deviceTokenJohnny',
    deviceToken: '123',
  },
  {
    uid: usersList[1].uid,
    username: usersList[1].username,
    headerInfo: {
      ip: '192.168.1.1',
      userAgent: { ua: 'second-user-agent-string' } as IUAParser.IResult,
    },
    refreshTokenHash: 'somehash2078',
    firebaseDeviceToken: 'deviceTokenVi',
    deviceToken: '122',
  },
]

export const testPollsList = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    title: 'title 1',
    body: 'test text 1',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    body: 'test text 2',
    complexWorkflow: true,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.VOTING,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000003',
    title: 'title 3',
    body: 'test text 3',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.PUBLISHED,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000004',
    title: 'title 4',
    body: 'test text 4',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.PUBLISHED,
    authorUID: usersList[1].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000005',
    title: 'title 5',
    body: 'test text 5',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.FINISHED,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000006',
    title: 'title 6',
    body: 'test text 6',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.COMPLETED,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000007',
    title: 'title 7',
    body: 'test text 7',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.REJECTED,
    authorUID: usersList[0].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000008',
    title: 'title 8',
    body: 'test text 8',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: regularUserData.uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaac-bbbb-cccc-000000000011',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000012',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000021',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[1].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000022',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[1].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000031',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[2].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000032',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[2].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000041',
    title: 'First answer',
    authorUID: usersList[1].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[3].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000042',
    title: 'Second answer',
    authorUID: usersList[1].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[3].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000051',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[4].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000052',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[4].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000061',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000062',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000071',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[6].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000072',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.REJECTED,
    pollUID: testPollsList[6].uid,
    index: 1,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000081',
    title: 'First answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[7].uid,
    index: 0,
  },
  {
    uid: '00000000-aaac-bbbb-cccc-000000000082',
    title: 'Second answer',
    authorUID: usersList[0].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[7].uid,
    index: 1,
  },
]

export async function testDataForPushNotificationSeed(knex: Knex): Promise<void> {
  await knex('person').insert(personsList)
  await knex('users').insert(usersList)
  await knex('user_details').insert(userDetailsList)
  await knex('auth_data').insert(authDataList)
  await knex('poll').insert(testPollsList)
  await knex('poll_answer').insert(testPollAnswer)
}
