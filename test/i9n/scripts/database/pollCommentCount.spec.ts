import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { CommentEntity } from '../../../../src/iviche/comment/model/CommentEntity'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { pollCommentCount } from '../../../../src/iviche/jobs/functions/pollCommentCount'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { regularUserData } from '../../common/TestUtilities'
import { TestContext } from '../../context/TestContext'

describe('pollCommentCount', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('Count comment in poll', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN  polls and comment for it
    await knex<Poll>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000001',
        body: 'test text 1',
        title: 'title 1',
        status: PollStatus.COMPLETED,
      },
    ])
    await knex<Comment>('comment').insert([
      {
        uid: '00000001-baaa-bbbb-cccc-000000000001',
        entityType: CommentEntity.POLL,
        entityUID: '00000000-baaa-bbbb-cccc-000000000001',
        threadUID: '00000001-baaa-bbbb-cccc-000000000001',
        parentUID: undefined,
        text: 'First comment',
        createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
        authorUID: regularUserData.uid,
      },
    ])

    // WHEN exec our poll comment count
    await pollCommentCount(new DBConnection().getConnection())

    // THEN commentsCount should increase by one
    const poll = await knex('poll')
      .select('commentsCount')
      .first()
    expect(poll.commentsCount).toBe(1)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
