import 'reflect-metadata'

import axios from 'axios'
import Knex from 'knex'
import { container } from 'tsyringe'

import { Language } from '../../../../src/iviche/common/Language'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { Action, IndexTask } from '../../../../src/iviche/indexTaskQueue/model/IndexTask'
import { saveNewsFromWp } from '../../../../src/iviche/jobs/functions/saveNewsFromWp'
import { News } from '../../../../src/iviche/news/model/News'
import { NewsBody } from '../../../../src/iviche/news/model/NewsBody'
import { NewsSection } from '../../../../src/iviche/news/model/NewsSection'
import { NewsStatus } from '../../../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../../../src/iviche/news/model/NewsTheme'
import { WPNews } from '../../../../src/iviche/news/model/WPNews'
import { NewsServiceImpl } from '../../../../src/iviche/news/services/NewsServiceImpl'
import {
  newsSeed,
  newsSeedCleanup,
  testNewsBodyList,
  testNewsList,
} from '../../../database/seeds/TestNewsList'
import { journalistData } from '../../common/TestUtilities'
import { TestContext } from '../../context/TestContext'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Scheduler. SaveNewsFromWpJob', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('create 2 news', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN Wp news data for create
    const wpNewsData: Array<WPNews> = [
      {
        idPost: 10,
        alternativeLink: 'http://iveche.1gb.ua/?p=10',
        authorUID: 1,
        postDate: '2020-04-15T12:30:36+00:00',
        postModified: '2020-04-15T12:30:36+00:00',
        tags: ['тест1', 'test', 'Україна'],
        status: NewsStatus.DRAFT,
        newsSection: NewsSection.ANALYTICS,
        theme: NewsTheme.ECONOMY,
        newsBodyList: [
          {
            title: 'Тест',
            body: '<p>тест</p>\n',
            seoTitle: 'Запис тест',
            seoDescription: 'afwafawf',
            shortDescription: 'wwadawfwaf',
            language: Language.UA,
          },
          {
            title: 'Test',
            body: '<p>test</p>\n',
            seoTitle: 'Test',
            seoDescription: 'testtest',
            shortDescription: 'testik',
            language: Language.EN,
          },
        ],
      },
      {
        idPost: 11,
        alternativeLink: 'http://iveche.1gb.ua/?p=11',
        authorUID: 1,
        postDate: '2020-04-14T12:00:00+00:00',
        postModified: '2020-04-14T12:00:00+00:00',
        tags: ['катастрофи', 'РНБО', 'розслідування', 'Україна'],
        status: NewsStatus.PUBLISHED,
        newsSection: NewsSection.ANALYTICS,
        theme: NewsTheme.ECONOMY,
        newsBodyList: [
          {
            title: 'Тест',
            body: '<p>тест</p>\n',
            seoTitle: 'Запис тест',
            seoDescription: 'afwafawf',
            shortDescription: 'wwadawfwaf',
            language: Language.UA,
          },
          {
            title: 'Test',
            body: '<p>test</p>\n',
            seoTitle: 'Test',
            seoDescription: 'testtest',
            shortDescription: 'testik',
            language: Language.EN,
          },
        ],
      },
    ]

    // AND mock get request to WP
    mockedAxios.get.mockResolvedValueOnce({ data: wpNewsData })

    // WHEN exec our saveNewsFormWp script
    await saveNewsFromWp(new DBConnection().getConnection())

    // THEN check created news
    const news: Array<News> = await knex('news').select('*')
    expect(news.length).toBe(2)

    expect(news[0].wpID).toEqual(wpNewsData[0].idPost)
    expect(news[0].authorUID).toEqual(journalistData.uid)
    expect(news[0].createdAt).toEqual(DateUtility.fromISO(wpNewsData[0].postDate))
    expect(news[0].lastSyncAt).toEqual(DateUtility.fromISO(wpNewsData[0].postModified))

    expect(news[1].wpID).toEqual(wpNewsData[1].idPost)
    expect(news[1].authorUID).toEqual(journalistData.uid)
    expect(news[1].createdAt).toEqual(DateUtility.fromISO(wpNewsData[1].postDate))
    expect(news[1].lastSyncAt).toEqual(DateUtility.fromISO(wpNewsData[1].postModified))

    // AND we got 2 INDEX tasks in indexQueue
    const indexTasks: Array<IndexTask> = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(2)

    indexTasks.forEach(task => {
      expect(task.action).toEqual(Action.INDEX)
    })
  })

  test('update 1 news', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const newsService = container.resolve<NewsServiceImpl>('NewsService')

    // GIVEN 2 news in db
    await newsSeed(knex)
    // AND wp news data for update (postModified !== lastSyncAt from db)
    const wpNewsData: Array<WPNews> = [
      {
        idPost: 1,
        alternativeLink: 'http://iveche.1gb.ua/?p=10',
        authorUID: 1,
        postDate: testNewsList[0].createdAt.toISOString(),
        postModified: DateUtility.getNextDay(testNewsList[0].lastSyncAt).toISOString(),
        tags: ['hell', 'yeah'],
        status: NewsStatus.DRAFT,
        newsSection: NewsSection.ANALYTICS,
        theme: NewsTheme.ECONOMY,
        newsBodyList: [
          {
            title: 'title 1 ',
            seoTitle: 'seo Title 1',
            seoDescription: 'seoDescription 1',
            body: 'changed body TEST',
            language: Language.UA,
            shortDescription: 'shortDescription 1',
          },
          {
            title: 'title 2 ',
            seoTitle: 'seo Title 2',
            seoDescription: 'seoDescription 2',
            body: 'body 2',
            language: Language.RU,
            shortDescription: 'shortDescription 2',
          },
          {
            title: 'title 3',
            seoTitle: 'seo Title 3',
            seoDescription: 'seoDescription 3',
            body: 'body 3',
            language: Language.EN,
            shortDescription: 'shortDescription 3',
          },
        ],
      },
    ]

    // AND mock get request to WP
    mockedAxios.get.mockResolvedValueOnce({ data: wpNewsData })

    // WHEN exec our saveNewsFormWp script
    await saveNewsFromWp(new DBConnection().getConnection())

    // THEN news was updated
    const news = (await newsService.getBy('uid', testNewsList[0].uid)) as News
    expect(news.lastSyncAt).toEqual(DateUtility.fromISO(wpNewsData[0].postModified))

    const newsBodyCheck = news.newsBodyList.find(
      (newsBody: NewsBody) => newsBody.language === Language.UA,
    ) as NewsBody
    expect(newsBodyCheck.body).toEqual(wpNewsData[0].newsBodyList[0].body)

    // AND we got 1 INDEX tasks in indexQueue
    const indexTasks: Array<IndexTask> = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(1)

    indexTasks.forEach(task => {
      expect(task.action).toEqual(Action.INDEX)
    })
  })

  test('delete 1 news', async () => {
    const knex = container.resolve<Knex>('DBConnection')

    // GIVEN 2 news in db
    await newsSeed(knex)

    // AND wp news with status DELETED
    const wpNewsData: Array<WPNews> = [
      {
        idPost: 1,
        alternativeLink: 'http://iveche.1gb.ua/?p=10',
        authorUID: 1,
        postDate: testNewsList[0].createdAt.toISOString(),
        postModified: testNewsList[0].lastSyncAt.toISOString(),
        tags: ['hell', 'yeah'],
        status: NewsStatus.DELETED,
        newsSection: NewsSection.ANALYTICS,
        theme: NewsTheme.ECONOMY,
        newsBodyList: [
          {
            title: testNewsBodyList[0].title,
            seoTitle: testNewsBodyList[0].seoTitle,
            seoDescription: testNewsBodyList[0].seoDescription,
            body: testNewsBodyList[0].body,
            language: Language.UA,
            shortDescription: testNewsBodyList[0].shortDescription,
          },
          {
            title: testNewsBodyList[1].title,
            seoTitle: testNewsBodyList[1].seoTitle,
            seoDescription: testNewsBodyList[1].seoDescription,
            body: testNewsBodyList[1].body,
            language: Language.RU,
            shortDescription: testNewsBodyList[1].shortDescription,
          },
          {
            title: testNewsBodyList[2].title,
            seoTitle: testNewsBodyList[2].seoTitle,
            seoDescription: testNewsBodyList[2].seoDescription,
            body: testNewsBodyList[2].body,
            language: Language.EN,
            shortDescription: testNewsBodyList[2].shortDescription,
          },
        ],
      },
    ]

    // AND mock get request to WP
    mockedAxios.get.mockResolvedValueOnce({ data: wpNewsData })

    // WHEN exec our saveNewsFormWp script
    await saveNewsFromWp(new DBConnection().getConnection())

    // THEN news was deleted
    const news: Array<News> = await knex('news').select('*')
    expect(news.length).toBe(1)

    // AND we got 1 DELETED tasks in indexQueue
    const indexTasks: Array<IndexTask> = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(1)

    indexTasks.forEach(task => {
      expect(task.action).toEqual(Action.DELETE)
    })
  })

  afterEach(async done => {
    const knex = container.resolve<Knex>('DBConnection')
    await newsSeedCleanup(knex)
    done()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
