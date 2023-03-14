import * as Knex from 'knex'

import { Comment } from '../../../src/iviche/comment/model/Comment'
import { CommentEntity } from '../../../src/iviche/comment/model/CommentEntity'
import { Gender } from '../../../src/iviche/common/Gender'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Issue } from '../../../src/iviche/issue/model/Issue'
import { IssueReferenceType } from '../../../src/iviche/issue/model/IssueReferenceType'
import { IssueResolution } from '../../../src/iviche/issue/model/IssueResolution'
import { IssueType } from '../../../src/iviche/issue/model/IssueType'
import { AgeGroup } from '../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import {
  facebookUserData,
  moderatorData,
  publicUserData,
  regularUserData,
} from '../../i9n/common/TestUtilities'
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
    taAgeGroups: JSON.stringify([AgeGroup.TWENTY]),
    taGenders: JSON.stringify([Gender.MALE, Gender.FEMALE]),
    taSocialStatuses: JSON.stringify([SocialStatus.CLERK]),
    votingStartAt: DateUtility.fromISO('2020-01-13T13:43:30.212Z'),
    votingEndAt: DateUtility.fromISO('2020-01-15T13:43:30.212Z'),
    theme: Theme.DOMESTIC_POLICY,
    status: PollStatus.COMPLETED,
    authorUID: usersList[4].uid as string,
    answersCount: 2,
    votesCount: 3,
    taAddressRegion: Region.KHARKIV_REGION,
  },
]

export const testPollAnswer: Array<PollAnswer> = [
  {
    uid: '00000000-aaab-bbbb-cccc-000000000001',
    title: 'test1',
    authorUID: usersList[4].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 0,
  },
  {
    uid: '00000000-aaab-bbbb-cccc-000000000002',
    title: 'test2',
    authorUID: usersList[4].uid as string,
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    pollUID: testPollsList[0].uid,
    index: 1,
  },
]

export const testCommentDataList: Array<Comment> = [
  {
    uid: '00000001-baaa-bbbb-cccc-000000000001',
    entityType: CommentEntity.POLL,
    entityUID: testPollsList[0].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000001',
    parentUID: undefined,
    text: 'Люблю своего сына, Артаса',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-14T13:00:30.000Z'),
    authorUID: regularUserData.uid,
  },
]

export const testIssueList: Array<Issue> = [
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000001',
    type: IssueType.QUESTION,
    body: 'Is that the test question?',
    userUID: regularUserData.uid,
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000002',
    type: IssueType.PROPOSAL,
    body: 'Lets hide all polls? For joke, 1st april',
    userUID: facebookUserData.uid,
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000003',
    type: IssueType.COMPLAINT,
    body: '???????????',
    reference: testPollsList[0].uid,
    referenceObjectType: IssueReferenceType.POLL,
    userUID: facebookUserData.uid,
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000004',
    type: IssueType.REQUEST,
    body: 'Request?',
    userUID: publicUserData.uid,
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000005',
    type: IssueType.QUESTION,
    body: 'Question from anon user',
    issuerEmail: 'anonUser@iviche.com',
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000006',
    type: IssueType.PROPOSAL,
    body: 'Proposal from anon user',
    issuerEmail: 'anonUser@iviche.com',
    resolution: IssueResolution.PENDING,
    createdAt: DateUtility.fromISO('2020-02-02T12:00:30.000Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000007',
    type: IssueType.COMPLAINT,
    body: 'Артас нас предаст!',
    reference: testCommentDataList[0].uid,
    referenceObjectType: IssueReferenceType.COMMENT,
    userUID: facebookUserData.uid,
    resolution: IssueResolution.ANSWERED,
    comment: 'САМИ ЛЕСА ЛОРДЕРОНА ПРОШЕПТАЛИ ЕГО ИМЯ! ...',
    moderatorUID: moderatorData.uid,
    resolvedAt: DateUtility.fromISO('2020-01-15T09:00:00.000Z'),
    createdAt: DateUtility.fromISO('2020-01-14T13:30:30.000Z'),
  },
]

export async function testIssueSeed(knex: Knex): Promise<void> {
  await knex('poll').insert(testPollsList)
  await knex('poll_answer').insert(testPollAnswer)
  await knex('comment').insert(testCommentDataList)
  await knex('issue').insert(testIssueList)
}
