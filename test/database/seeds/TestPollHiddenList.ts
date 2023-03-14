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
import { regularUserData } from '../../i9n/common/TestUtilities'
import { usersList } from './01_InitialData'

// NOTE: For the best work we need to create interface for DB data instead of any
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testHiddenPollsList: Array<any> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    body: 'test text 1',
    title: 'title 1',
    complexWorkflow: false,
    anonymous: false,
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
    isHidden: false,
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
    status: PollStatus.PUBLISHED,
    authorUID: regularUserData.uid,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    isHidden: false,
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
    status: PollStatus.PUBLISHED,
    authorUID: usersList[2].uid as string,
    answersCount: 2,
    votesCount: 0,
    taAddressRegion: Region.KHARKIV_REGION,
    isHidden: true,
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
    isHidden: false,
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
    isHidden: false,
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
    isHidden: false,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000001',
    title: 'test1',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000002',
    title: 'test2',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[0].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000003',
    title: 'test3',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[1].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000004',
    title: 'test4',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[1].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000005',
    title: 'test5',
    authorUID: regularUserData.uid,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[2].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000006',
    title: 'test6',
    authorUID: regularUserData.uid,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[2].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000007',
    title: 'test7',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[3].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000008',
    title: 'test8',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[3].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000001',
    title: 'test count answers 1',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testHiddenPollsList[4].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000002',
    title: 'test count answers 2',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testHiddenPollsList[4].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000003',
    title: 'test  count answers 3',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.MODERATION,
    pollUID: testHiddenPollsList[4].uid,
    index: 2,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000004',
    title: 'test  count answers 4',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[5].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000005',
    title: 'test count answers 5',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[5].uid,
    index: 1,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000006',
    title: 'test count answers 6',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[5].uid,
    index: 2,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-100000000007',
    title: 'test count answers 7',
    authorUID: usersList[2].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testHiddenPollsList[5].uid,
    index: 3,
  },
]

export async function pollHiddenListSeed(knex: Knex, elastic?: Elastic): Promise<void> {
  if (elastic) {
    // TODO: rewrite it to bulk
    for (const poll of testHiddenPollsList) {
      const indexBody: PollIndex = PollUtility.toPollIndex(poll)

      await elastic.index(poll.uid, EntityNames.poll, indexBody)
    }
  }
  await knex('poll').insert(testHiddenPollsList)
  await knex('poll_answer').insert(testPollAnswer)
}
