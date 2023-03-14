import * as Knex from 'knex'

import { Region } from '../../../src/iviche/common/Region'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Moderation } from '../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationType } from '../../../src/iviche/moderation/model/ModerationType'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { moderatorData } from '../../i9n/common/TestUtilities'
import { usersList } from './01_InitialData'

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPollsListSecurity: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    body: 'test text 1',
    title: 'title 1',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DRAFT,
    authorUID: usersList[5].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    body: 'test text 2',
    complexWorkflow: false,
    anonymous: false,
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.REJECTED,
    authorUID: usersList[5].uid as string,
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
    status: PollStatus.MODERATION,
    authorUID: usersList[5].uid as string,
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
    status: PollStatus.DISCUSSION,
    authorUID: usersList[5].uid as string,
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
    status: PollStatus.REJECTED,
    authorUID: usersList[5].uid as string,
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
    status: PollStatus.DRAFT,
    authorUID: usersList[5].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000001',
    title: 'test1',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000002',
    title: 'test2',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[0].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000003',
    title: 'test3',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[1].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000004',
    title: 'test4',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[1].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000005',
    title: 'test5',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[2].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000006',
    title: 'test6',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[2].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000007',
    title: 'test7',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[3].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000008',
    title: 'test8',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[3].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000009',
    title: 'test9',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[4].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000010',
    title: 'test10',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[4].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000011',
    title: 'test11',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[5].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000012',
    title: 'test12',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListSecurity[5].uid,
    index: 1,
  },
]

export const testModerationCasesSecurity: Array<Moderation> = [
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000001',
    type: ModerationType.POLL,
    summary: 'first test summary',
    moderatorUID: moderatorData.uid,
    reference: testPollsListSecurity[1].uid,
    resolution: ModerationResolutionType.REJECTED,
    resolvedAt: DateUtility.fromISO('2020-01-01T12:00:00.000Z'),
    lockingCounter: 0,
    concern: 'test1',
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000002',
    type: ModerationType.POLL,
    summary: 'second test summary',
    moderatorUID: moderatorData.uid,
    reference: testPollsListSecurity[4].uid,
    resolution: ModerationResolutionType.REJECTED,
    resolvedAt: DateUtility.fromISO('2020-01-01T12:00:00.000Z'),
    lockingCounter: 0,
    concern: 'test2',
  },
]

export async function pollSecuritySeed(knex: Knex): Promise<void> {
  await knex('poll').insert(testPollsListSecurity)
  await knex('poll_answer').insert(testPollAnswer)
  await knex('moderation_case').insert(testModerationCasesSecurity)
}
