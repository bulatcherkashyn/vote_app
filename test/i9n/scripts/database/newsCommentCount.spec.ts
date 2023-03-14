import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { CommentEntity } from '../../../../src/iviche/comment/model/CommentEntity'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { newsCommentCount } from '../../../../src/iviche/jobs/functions/newsCommentCount'
import { News } from '../../../../src/iviche/news/model/News'
import { NewsStatus } from '../../../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../../../src/iviche/news/model/NewsTheme'
import { regularUserData } from '../../common/TestUtilities'
import { TestContext } from '../../context/TestContext'

describe('newsCommentCount', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  beforeEach(async done => {
    const knex = container.resolve<Knex>('DBConnection')
    await knex('news').del()
    await knex('comment').del()
    done()
  })

  test('Default commentCount value is 0', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN news withount comments
    await knex<News>('news').insert([
      {
        uid: '00000000-cccc-bbbb-aaaa-000000000001',
        headerImage: 'headerImage',
        theme: NewsTheme.ECONOMY,
        status: NewsStatus.PUBLISHED,
      },
    ])
    // WHEN update newsCommentCount run
    await newsCommentCount(new DBConnection().getConnection())

    // THEN nothing will happen
    const news = await knex('news')
      .select('commentsCount')
      .first()
    expect(news.commentsCount).toBe(0)
  })

  test('Add comment count in news', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN news without comments
    await knex<News>('news').insert([
      {
        uid: '00000000-cccc-bbbb-aaaa-000000000001',
        headerImage: 'headerImage',
        theme: NewsTheme.ECONOMY,
        status: NewsStatus.PUBLISHED,
      },
    ])
    //AND we add 2 comments
    await knex<Comment>('comment').insert([
      {
        uid: '00000001-cccc-bbbb-aaaa-000000000001',
        entityType: CommentEntity.NEWS,
        entityUID: '00000000-cccc-bbbb-aaaa-000000000001',
        threadUID: '00000001-cccc-bbbb-aaaa-000000000001',
        parentUID: undefined,
        text: 'First comment',
        createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
        authorUID: regularUserData.uid,
      },
      {
        uid: '00000001-cccc-bbbb-aaaa-000000000002',
        entityType: CommentEntity.NEWS,
        entityUID: '00000000-cccc-bbbb-aaaa-000000000001',
        threadUID: '00000001-cccc-bbbb-aaaa-000000000001',
        parentUID: undefined,
        text: 'First comment',
        createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
        authorUID: regularUserData.uid,
      },
    ])
    //WHEN update newsCommentCount run
    await newsCommentCount(new DBConnection().getConnection())

    // THEN commentsCount should increase by two
    const news = await knex('news')
      .select('commentsCount')
      .first()
    expect(news.commentsCount).toBe(2)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
