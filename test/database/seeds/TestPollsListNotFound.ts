import * as Knex from 'knex'

import { Region } from '../../../src/iviche/common/Region'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Moderation } from '../../../src/iviche/moderation/model/Moderation'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { usersList } from './01_InitialData'

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPollsListNotFound: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    title: 'title 1',
    body: 'test text 1',
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
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000001',
    title: 'test1',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListNotFound[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000002',
    title: 'test2',
    authorUID: usersList[5].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsListNotFound[0].uid,
    index: 1,
  },
]

export const testModerationCasesSecurity: Array<Moderation> = []

export async function pollNotFoundSeed(knex: Knex): Promise<void> {
  await knex('poll').insert(testPollsListNotFound)
  await knex('poll_answer').insert(testPollAnswer)
}
