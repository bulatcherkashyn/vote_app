import { List } from 'immutable'

import { Theme } from '../../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../../src/iviche/common/utils/DateUtility'
import { Poll } from '../../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { testPollAnswer, testPollsList } from '../../../../database/seeds/TestPollsList'
import { publicUserData } from '../../../common/TestUtilities'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultPollData: any = {
  anonymous: true,
  complexWorkflow: false,
  authorUID: publicUserData.uid,
  status: PollStatus.MODERATION,
  tags: List(),
  taGenders: List(),
  taAgeGroups: List(),
  competencyTags: List(),
  taSocialStatuses: List(),
  theme: Theme.AGRICULTURE,
  votingStartAt: new Date('01.02.2020'),
  votingEndAt: new Date('02.02.2020'),
  commentsCount: 0,
  isHidden: false,
}

export const pollsList: Array<Poll> = [
  {
    ...defaultPollData,
    uid: testPollsList[0].uid,
    body: testPollsList[0].body,
    title: testPollsList[0].title,
    publishedAt: DateUtility.fromISO('2020-01-13T13:43:30.212Z'),
    pollType: PollType.REGULAR,
    answers: List([
      {
        title: testPollAnswer[0].title,
        authorUID: testPollAnswer[0].authorUID,
      },
      {
        uid: testPollAnswer[1].uid,
        title: testPollAnswer[1].title,
        authorUID: testPollAnswer[1].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[1].uid,
    anonymous: true,
    body: testPollsList[1].body,
    title: testPollsList[1].title,
    theme: testPollsList[1].theme,
    publishedAt: DateUtility.fromISO('2020-01-15T13:43:30.212Z'),
    answers: List([
      {
        uid: testPollAnswer[2].uid,
        title: testPollAnswer[2].title,
        authorUID: testPollAnswer[2].authorUID,
      },
      {
        uid: testPollAnswer[3].uid,
        title: testPollAnswer[3].title,
        authorUID: testPollAnswer[3].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[2].uid,
    anonymous: true,
    body: testPollsList[2].body,
    title: testPollsList[2].title,
    publishedAt: DateUtility.fromISO('2020-01-17T13:43:30.212Z'),
    pollType: PollType.REGULAR,
    status: PollStatus.REJECTED,
    answers: List([
      {
        uid: testPollAnswer[4].uid,
        title: testPollAnswer[4].title,
        authorUID: testPollAnswer[4].authorUID,
      },
      {
        uid: testPollAnswer[5].uid,
        title: testPollAnswer[5].title,
        authorUID: testPollAnswer[5].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[3].uid,
    anonymous: true,
    body: testPollsList[3].body,
    title: testPollsList[3].title,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    pollType: PollType.REGULAR,
    answers: List([
      {
        uid: testPollAnswer[6].uid,
        title: testPollAnswer[6].title,
        authorUID: testPollAnswer[6].authorUID,
      },
      {
        uid: testPollAnswer[7].uid,
        title: testPollAnswer[7].title,
        authorUID: testPollAnswer[7].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[4].uid,
    anonymous: true,
    body: testPollsList[4].body,
    title: testPollsList[4].title,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    pollType: PollType.REGULAR,
    answers: List([
      {
        uid: testPollAnswer[8].uid,
        title: testPollAnswer[8].title,
        authorUID: testPollAnswer[8].authorUID,
      },
      {
        uid: testPollAnswer[9].uid,
        title: testPollAnswer[9].title,
        authorUID: testPollAnswer[9].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[5].uid,
    anonymous: true,
    body: testPollsList[5].body,
    title: testPollsList[5].title,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    answers: List([
      {
        uid: testPollAnswer[11].uid,
        title: testPollAnswer[11].title,
        authorUID: testPollAnswer[11].authorUID,
      },
      {
        uid: testPollAnswer[12].uid,
        title: testPollAnswer[12].title,
        authorUID: testPollAnswer[12].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[6].uid,
    anonymous: true,
    body: testPollsList[6].body,
    title: testPollsList[6].title,
    pollType: PollType.BLITZ,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    answers: List([
      {
        uid: testPollAnswer[11].uid,
        title: testPollAnswer[11].title,
        authorUID: testPollAnswer[11].authorUID,
      },
      {
        uid: testPollAnswer[12].uid,
        title: testPollAnswer[12].title,
        authorUID: testPollAnswer[12].authorUID,
      },
    ]),
  },
  {
    ...defaultPollData,
    uid: testPollsList[7].uid,
    anonymous: true,
    body: testPollsList[7].body,
    title: testPollsList[7].title,
    pollType: PollType.RATING_MONITOR,
    publishedAt: DateUtility.fromISO('2020-01-19T13:43:30.212Z'),
    answers: List([
      {
        uid: testPollAnswer[11].uid,
        title: testPollAnswer[11].title,
        authorUID: testPollAnswer[11].authorUID,
      },
      {
        uid: testPollAnswer[12].uid,
        title: testPollAnswer[12].title,
        authorUID: testPollAnswer[12].authorUID,
      },
    ]),
  },
]
