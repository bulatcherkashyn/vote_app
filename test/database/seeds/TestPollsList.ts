import { List } from 'immutable'
import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { PollUtility } from '../../../src/iviche/common/PollUtility'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { Moderation } from '../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationType } from '../../../src/iviche/moderation/model/ModerationType'
import { AgeGroup } from '../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollIndex } from '../../../src/iviche/polls/models/PollIndex'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../src/iviche/polls/models/PollType'
import { StatisticsType } from '../../../src/iviche/statistics/model/StatisticsType'
import { VotingRoundType } from '../../../src/iviche/voting/model/VotingRoundType'
import { moderatorData, regularUserData } from '../../i9n/common/TestUtilities'
import { usersList } from './01_InitialData'
import { testPollsListSecurity } from './TestPollListSecurity'

// NOTE: For the best work we need to create interface for DB data instead of any
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPollsList: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    body: 'test text 1',
    title: 'title 1',
    complexWorkflow: false,
    anonymous: false,
    tags: List(['xxx']),
    publishedAt: DateUtility.fromISO('2020-01-13T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.COMPLETED,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 3,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    body: 'test text 2',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-15T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.EDUCATION,
    status: PollStatus.MODERATION,
    authorUID: regularUserData.uid,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000003',
    title: 'Unique special title bravo',
    body: 'test text 3',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-17T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.REJECTED,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000004',
    title: 'title 4',
    body: 'test text 4',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DRAFT,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000005',
    title: 'poll with 3 (false) comment count, votesCount',
    body: 'test text 5',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: usersList[2].uid as string,
    answersCount: 3,
    votesCount: 3,
    commentsCount: 3,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000006',
    title: 'poll with 2 (false) comment count',
    body: 'test text 6',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.MODERATION,
    authorUID: usersList[2].uid as string,
    answersCount: 4,
    votesCount: 2,
    commentsCount: 2,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.REGULAR,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000007',
    title: 'title 4',
    body: 'test text 4',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([]),
    taGenders: JSON.stringify([]),
    taSocialStatuses: JSON.stringify([]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DRAFT,
    authorUID: usersList[1].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.BLITZ,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000008',
    title: 'title 5',
    body: 'test text5',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-20T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([]),
    taGenders: JSON.stringify([]),
    taSocialStatuses: JSON.stringify([]),
    votingStartAt: DateUtility.fromISO('2020-01-03'),
    votingEndAt: undefined,
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DRAFT,
    authorUID: usersList[1].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    pollType: PollType.RATING_MONITOR,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000001',
    title: 'test1',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000002',
    title: 'test2',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000003',
    title: 'test3',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[1].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000004',
    title: 'test4',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[1].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000005',
    title: 'test5',
    authorUID: regularUserData.uid,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[2].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000006',
    title: 'test6',
    authorUID: regularUserData.uid,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[2].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000007',
    title: 'test7',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[3].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000008',
    title: 'test8',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[3].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000001',
    title: 'test count answers 1',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testPollsList[4].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000002',
    title: 'test count answers 2',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testPollsList[4].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000003',
    title: 'test  count answers 3',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testPollsList[4].uid,
    index: 2,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000004',
    title: 'test  count answers 4',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000005',
    title: 'test count answers 5',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000006',
    title: 'test count answers 6',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 2,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000007',
    title: 'test count answers 7',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[5].uid,
    index: 3,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000009',
    title: 'test count answers 7',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[6].uid,
    index: 3,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000010',
    title: 'test count answers 7',
    authorUID: usersList[11].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[6].uid,
    index: 3,
  },
]

export const votingResults = [
  {
    votingRoundUID: testPollsList[0].uid,
    statisticsType: StatisticsType.VOTES_DYNAMICS,
    key0: SocialStatus.STUDENT,
    key1: AgeGroup.FORTY_FIVE,
    key2: Gender.MALE,
    value: { date: DateUtility.fromISO('2020-01-22T12:43:30.000Z'), value: 1 },
    finalAggregation: true,
    createdAt: DateUtility.fromISO('2020-01-23T12:43:30.000Z').toISOString(),
  },
  {
    votingRoundUID: testPollsList[0].uid,
    statisticsType: StatisticsType.VOTES_DYNAMICS,
    key0: SocialStatus.STUDENT,
    key1: AgeGroup.FORTY_FIVE,
    key2: Gender.MALE,
    value: { date: DateUtility.fromISO('2020-01-23T12:43:30.000Z'), value: 2 },
    finalAggregation: true,
    createdAt: DateUtility.fromISO('2020-01-24T12:43:30.000Z').toISOString(),
  },
  {
    votingRoundUID: testPollsList[0].uid,
    statisticsType: StatisticsType.RESULTS_GEOGRAPHY,
    key0: '00000000-aaaa-aaaa-aaaa-000000000001',
    key1: Region.POLTAVA_REGION,
    value: { town: 'town1', value: 1 },
    finalAggregation: true,
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z').toISOString(),
  },
]

const testVotingRound = {
  uid: testPollsList[0].uid,
  type: VotingRoundType.VOTING,
  createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  startedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  endedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
}

export const testModerationCases: Array<Moderation> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000010',
    type: ModerationType.POLL,
    summary: 'first test summary',
    moderatorUID: moderatorData.uid,
    reference: testPollsListSecurity[2].uid,
    resolution: ModerationResolutionType.REJECTED,
    resolvedAt: DateUtility.fromISO('2020-01-01T12:00:00.000Z'),
    lockingCounter: 0,
    concern: 'test1',
  },
]

export async function pollSeed(knex: Knex, elastic?: Elastic): Promise<void> {
  if (elastic) {
    // TODO: rewrite it to bulk
    for (const poll of testPollsList) {
      const indexBody: PollIndex = PollUtility.toPollIndex(poll)

      await elastic.index(poll.uid, EntityNames.poll, indexBody)
    }
  }
  await knex('poll').insert(testPollsList)
  await knex('poll_answer').insert(testPollAnswer)
  await knex('voting_round').insert(testVotingRound)
  await knex('voting_result').insert(votingResults)
  await knex('moderation_case').insert(testModerationCases)
}
