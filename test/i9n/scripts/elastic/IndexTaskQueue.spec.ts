import 'reflect-metadata'

import { List } from 'immutable'
import Knex from 'knex'
import { container } from 'tsyringe'

import { Language } from '../../../../src/iviche/common/Language'
import { Theme } from '../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { Action, ReferenceType } from '../../../../src/iviche/indexTaskQueue/model/IndexTask'
import { elasticIndexer } from '../../../../src/iviche/jobs/IndexTaskQueue/elasticIndexer'
import { NewsIndex } from '../../../../src/iviche/news/model/NewsIndex'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollIndex } from '../../../../src/iviche/polls/models/PollIndex'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { sleep } from '../../../unit/utility/sleep'
import { TestContext } from '../../context/TestContext'

describe('IndexTaskQueueJob', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('INDEX', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN 1 poll and 1 news with 2 news body and their rows in task queue
    await knex<Poll>('poll').insert({
      uid: '00000000-baaa-bbbb-cccc-000000000001',
      status: PollStatus.MODERATION,
      body: 'Somebody',
      theme: Theme.BUSINESS,
      title: '4Head',
      complexWorkflow: true,
      authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
    })

    await knex('news').insert({
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      tags: List(['hell', 'yeah']),
      authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
      pollUID: '00000000-baaa-bbbb-cccc-000000000001',
      alternativeLink: 'alternativeLink 1',
    })

    await knex('news_body').insert([
      {
        uid: '00000000-aaaa-aaaa-aaab-000000000001',
        language: Language.UA,
        seoTitle: 'seoTitle 1',
        seoDescription: 'seoDescription 1',
        title: 'title 1',
        body: 'body 1',
        shortDescription: 'bla bla 1',
        newsUID: '00000000-aaaa-aaaa-aaaa-000000000001',
      },
      {
        uid: '00000000-aaaa-aaaa-aaab-000000000002',
        language: Language.RU,
        seoTitle: 'seoTitle 2',
        seoDescription: 'seoDescription 2',
        title: 'title 2',
        body: 'body 2',
        shortDescription: 'bla bla 2',
        newsUID: '00000000-aaaa-aaaa-aaaa-000000000001',
      },
    ])

    await knex('index_task').insert([
      {
        uid: '00000000-aaaa-aaaa-aaab-000000000004',
        referenceType: ReferenceType.POLL,
        referenceUID: '00000000-baaa-bbbb-cccc-000000000001',
        action: Action.INDEX,
        createdAt: DateUtility.now(),
      },
      {
        uid: '00000000-aaaa-aaaa-aaab-000000000005',
        referenceType: ReferenceType.NEWS,
        referenceUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        action: Action.INDEX,
        createdAt: DateUtility.now(),
      },
    ])

    // WHEN exec our elasticIndexer
    await elasticIndexer(new DBConnection().getConnection())

    // THEN queue should be empty
    const tasks = await knex('index_task').select('*')
    expect(tasks.length).toBe(0)
    // And records in elastic
    await sleep(5000)
    const elastic = container.resolve<Elastic>('Elastic')

    const elasticPolls = await elastic.search<PollIndex>('poll')

    expect(elasticPolls.total.value).toBe(1)

    const pollObject = elasticPolls.hits[0]._source

    expect(pollObject.uid).toEqual('00000000-baaa-bbbb-cccc-000000000001')
    expect(pollObject.body).toEqual('Somebody')
    expect(pollObject.theme).toEqual(Theme.BUSINESS)
    expect(pollObject.status).toEqual(PollStatus.MODERATION)

    const elasticNews = await elastic.search<NewsIndex>('news')

    expect(elasticNews.total.value).toBe(1)

    const newsObject = elasticNews.hits[0]._source

    expect(newsObject.uid).toEqual('00000000-aaaa-aaaa-aaaa-000000000001')
    expect(newsObject.authorName).toEqual('Pericles')
    expect(newsObject.tags).toEqual('hell yeah')
    expect(newsObject.newsBody).toEqual('title 2 body 2 title 1 body 1')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
