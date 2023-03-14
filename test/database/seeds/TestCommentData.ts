import { Comment } from '../../../src/iviche/comment/model/Comment'
import { CommentEntity } from '../../../src/iviche/comment/model/CommentEntity'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import {
  administratorData,
  facebookUserData,
  regularUserData,
} from '../../i9n/common/TestUtilities'
import Knex = require('knex')
import { testNewsList } from './TestNewsList'

export const testCommentData: Array<Comment> = [
  {
    uid: '00000001-baaa-bbbb-cccc-000000000001',
    entityType: CommentEntity.NEWS,
    entityUID: testNewsList[1].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000001',
    parentUID: undefined,
    text: 'First comment',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
    authorUID: regularUserData.uid,
  },
  {
    uid: '00000001-baaa-bbbb-cccc-000000000002',
    entityType: CommentEntity.NEWS,
    entityUID: testNewsList[1].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000001',
    parentUID: '00000001-baaa-bbbb-cccc-000000000001',
    text: 'Second under the first comment',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-02T13:43:30.000Z'),
    authorUID: administratorData.uid,
  },
  {
    uid: '00000001-baaa-bbbb-cccc-000000000003',
    entityType: CommentEntity.NEWS,
    entityUID: testNewsList[1].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000001',
    parentUID: '00000001-baaa-bbbb-cccc-000000000002',
    text: 'Third under the second comment',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-02T14:43:30.000Z'),
    authorUID: facebookUserData.uid,
  },
  {
    uid: '00000001-baaa-bbbb-cccc-000000000004',
    entityType: CommentEntity.NEWS,
    entityUID: testNewsList[1].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000004',
    parentUID: undefined,
    text: '4th comment',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-02T13:13:30.000Z'),
    authorUID: facebookUserData.uid,
  },
  {
    uid: '00000001-baaa-bbbb-cccc-000000000005',
    entityType: CommentEntity.NEWS,
    entityUID: testNewsList[1].uid,
    threadUID: '00000001-baaa-bbbb-cccc-000000000004',
    parentUID: '00000001-baaa-bbbb-cccc-000000000004',
    text: '5th comment',
    likesCounter: 0,
    dislikesCounter: 0,
    ratedBy: {},
    reports: '{}',
    createdAt: DateUtility.fromISO('2020-01-02T17:13:30.000Z'),
    authorUID: regularUserData.uid,
  },
]

export async function commentSeed(knex: Knex): Promise<void> {
  await knex('comment').insert(testCommentData)
}
