import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { PollUtility } from '../../../src/iviche/common/PollUtility'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { AgeGroup } from '../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollIndex } from '../../../src/iviche/polls/models/PollIndex'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../src/iviche/polls/models/PollType'
import { VotingRound } from '../../../src/iviche/voting/model/VotingRound'
import { VotingRoundType } from '../../../src/iviche/voting/model/VotingRoundType'
import { usersList } from './01_InitialData'

// NOTE: For the best work we need to create interface for DB data instead of any
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPollsList: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000011',
    body: 'sum 41',
    title: 'sums',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-13T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.DISCUSSION,
    authorUID: usersList[4].uid as string,
    answersCount: 1,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000012',
    title: 'Chemical romance',
    body: 'tututu',
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-15T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.EDUCATION,
    status: PollStatus.VOTING,
    authorUID: usersList[4].uid as string,
    answersCount: 1,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
  {
    uid: '00000000-baaa-bbbb-cccc-000000000013',
    title: 'Poll with Blitz',
    body: "I'm a shark",
    complexWorkflow: false,
    anonymous: false,
    publishedAt: DateUtility.fromISO('2020-01-15T13:43:30.212Z'),
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-02'),
    votingEndAt: DateUtility.fromISO('2020-01-15'),
    theme: Theme.EDUCATION,
    status: PollStatus.VOTING,
    pollType: PollType.BLITZ,
    authorUID: usersList[1].uid as string,
    answersCount: 1,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000016',
    title: 'Knights',
    authorUID: usersList[4].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000017',
    title: 'Mages',
    authorUID: usersList[4].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[1].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000018',
    title: 'Test Blitz poll',
    authorUID: usersList[1].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[2].uid,
    index: 0,
  },
]

const testVotingRound: Array<VotingRound> = [
  {
    uid: testPollsList[0].uid,
    type: VotingRoundType.DISCUSSION,
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    startedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    endedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  },

  {
    uid: testPollsList[1].uid,
    type: VotingRoundType.VOTING,
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    startedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    endedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  },
  {
    uid: testPollsList[2].uid,
    type: VotingRoundType.VOTING,
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    startedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    endedAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  },
]

export async function pollVoteSeed(knex: Knex, elastic?: Elastic): Promise<void> {
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
}
