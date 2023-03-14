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
import { StatisticsType } from '../../../src/iviche/statistics/model/StatisticsType'
import { Vote } from '../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../src/iviche/voting/model/VotingRoundType'
import { VoteServiceImpl } from '../../../src/iviche/voting/service/VoteServiceImpl'
import { regularUserData, veryfiedPublicUserData } from '../../i9n/common/TestUtilities'
import { usersList } from './01_InitialData'

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPollsList: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    body: 'test text 1',
    title: 'title 1',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-13T13:43:30.212Z'),
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.COMPLETED,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 3,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    body: 'test text 2',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2100-08-18T00:00:00.000Z'),
    votingStartAt: DateUtility.fromISO('2100-08-19T00:00:00.000Z'),
    votingEndAt: DateUtility.fromISO('2100-08-20T00:00:00.000Z'),
    theme: Theme.EDUCATION,
    status: PollStatus.MODERATION,
    authorUID: regularUserData.uid,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    tags: List(['test']),
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000003',
    title: 'Unique special title bravo',
    body: 'test text 3',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-17T13:43:30.212Z'),
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.REJECTED,
    authorUID: usersList[2].uid as string,
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
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    votingStartAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    votingEndAt: DateUtility.fromISO('2020-02-02T12:43:30.000Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DRAFT,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-bbaa-bbbb-cccc-220000000001',
    title: 'discusion poll for moderation test',
    body: 'test text discusion index 4',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-bbaa-bbbb-cccc-220000000002',
    title: 'discusion poll for moderation test',
    body: 'test text discusion index 4',
    complexWorkflow: true,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
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
    uid: '00000000-aabb-bbbb-cccc-200000000001',
    title: 'disscussion answer 1',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[4].uid,
    index: 0,
  },
  {
    uid: '00000000-aabb-bbbb-cccc-200000000002',
    title: 'discusion answer 2',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[4].uid,
    index: 1,
  },
  {
    uid: '00000000-aaaa-bbbc-cccc-000000000001',
    status: PollAnswerStatus.MODERATION,
    basic: false,
    authorUID: veryfiedPublicUserData.uid,
    index: 1000000,
    pollUID: testPollsList[4].uid,
    title: 'new test moderation answer',
  },
  {
    uid: '00000000-aaaa-bbbc-cccc-000000000002',
    status: PollAnswerStatus.PUBLISHED,
    basic: true,
    authorUID: usersList[2].uid as string,
    index: 1,
    pollUID: testPollsList[5].uid,
    title: 'published answer 1',
  },
  {
    uid: '00000000-aaaa-bbbc-cccc-000000000003',
    status: PollAnswerStatus.PUBLISHED,
    basic: true,
    authorUID: usersList[2].uid as string,
    index: 1,
    pollUID: testPollsList[5].uid,
    title: 'published answer 2',
  },
  {
    uid: '00000000-aaaa-bbbc-cccc-000000000004',
    status: PollAnswerStatus.REJECTED,
    basic: false,
    authorUID: veryfiedPublicUserData.uid,
    index: 1000000,
    pollUID: testPollsList[5].uid,
    title: 'new test rejected answer',
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

export const testVoteList: Array<Vote> = [
  {
    ageGroup: AgeGroup.TWENTY,
    createdAt: DateUtility.fromISO('2020-01-02T15:43:30.000Z'),
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    votingRoundUID: testVotingRound.uid,
    addressRegion: Region.KHARKIV_REGION,
    roundStatus: testVotingRound.type,
    pollAnswerUID: testPollAnswer[10].uid as string,
    voterSeed: VoteServiceImpl.prototype['generateVoterSeed'].bind({
      secret: process.env.VOTER_SEED_SECRET || 'secret',
    })(testPollsList[4].uid, veryfiedPublicUserData.uid),
  },
  {
    ageGroup: AgeGroup.TWENTY,
    createdAt: DateUtility.fromISO('2020-01-02T15:43:30.000Z'),
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    votingRoundUID: testVotingRound.uid,
    addressRegion: Region.KHARKIV_REGION,
    roundStatus: testVotingRound.type,
    pollAnswerUID: testPollAnswer[11].uid as string,
    voterSeed: VoteServiceImpl.prototype['generateVoterSeed'].bind({
      secret: process.env.VOTER_SEED_SECRET || 'secret',
    })(testPollsList[5].uid, veryfiedPublicUserData.uid),
  },
]

export const testModerationArray: Array<Moderation> = [
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000006',
    reference: testPollAnswer[13].uid as string,
    resolution: ModerationResolutionType.REJECTED,
    type: ModerationType.POLL_ANSWER,
    concern: 'test',
    summary: testPollAnswer[13].title,
    moderatorUID: usersList[1].uid as string,
    lockingCounter: 0,
  },
]

export async function pollModerationSeed(knex: Knex, elastic?: Elastic): Promise<void> {
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
  await knex('vote').insert(testVoteList)
  await knex('voting_result').insert(votingResults)
  await knex('moderation_case').insert(testModerationArray)
}
