import { List } from 'immutable'
import * as Knex from 'knex'

import { Language } from '../../../src/iviche/common/Language'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { NewsBody } from '../../../src/iviche/news/model/NewsBody'
import { NewsIndex } from '../../../src/iviche/news/model/NewsIndex'
import { NewsSection } from '../../../src/iviche/news/model/NewsSection'
import { NewsStatus } from '../../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../../src/iviche/news/model/NewsTheme'
import { journalistData } from '../../i9n/common/TestUtilities'

export const testNewsList = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000001',
    tags: JSON.stringify(List(['hell', 'yeah'])),
    authorUID: journalistData.uid,
    theme: NewsTheme.ECONOMY,
    pollUID: null,
    section: NewsSection.COMMON,
    alternativeLink: 'alternativeLink-1',
    wpID: 1,
    commentsCount: 0,
    status: NewsStatus.PUBLISHED,
    createdAt: DateUtility.subtractDays(),
    lastSyncAt: DateUtility.subtractDays(),
    publishedAt: DateUtility.fromISO('2020-04-14T12:51:21.189Z'),
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000002',
    tags: JSON.stringify(List(['hell', 'test'])),
    authorUID: journalistData.uid,
    theme: NewsTheme.POLITICAL_MAP,
    section: NewsSection.MAIN,
    pollUID: null,
    alternativeLink: 'alternativeLink-2',
    wpID: 2,
    commentsCount: 0,
    status: NewsStatus.PUBLISHED,
    createdAt: DateUtility.subtractDays(),
    lastSyncAt: DateUtility.subtractDays(),
    publishedAt: DateUtility.fromISO('2020-05-14T12:51:21.189Z'),
  },
]

export const testNewsBodyList: Array<NewsBody> = [
  {
    uid: '00000000-aaaa-aaaa-aaab-000000000001',
    language: Language.UA,
    seoTitle: 'seoTitle 1',
    seoDescription: 'seoDescription 1',
    title: 'title 1',
    body: 'body 1',
    shortDescription: 'shortDescription 1',
    newsUID: testNewsList[0].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaab-000000000002',
    language: Language.RU,
    seoTitle: 'seoTitle 2',
    seoDescription: 'seoDescription 2',
    title: 'title 2',
    body: 'body 2 i love COOKIES',
    shortDescription: 'shortDescription 2',
    newsUID: testNewsList[0].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaab-000000000003',
    language: Language.EN,
    seoTitle: 'seoTitle 3',
    seoDescription: 'seoDescription 3',
    title: 'title 3',
    body: 'body 3',
    shortDescription: 'shortDescription 3',
    newsUID: testNewsList[0].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaab-000000000004',
    language: Language.UA,
    seoTitle: 'seoTitle 4',
    seoDescription: 'seoDescription 4',
    title: 'title 4',
    body: 'body 4',
    shortDescription: 'shortDescription 4',
    newsUID: testNewsList[1].uid,
  },
  {
    uid: '00000000-aaaa-aaaa-aaab-000000000005',
    language: Language.RU,
    seoTitle: 'seoTitle 5',
    seoDescription: 'seoDescription 5',
    title: 'title 5',
    body: 'body 5',
    shortDescription: 'shortDescription 5',
    newsUID: testNewsList[1].uid,
  },
]

export const testNewsArray = [
  {
    ...testNewsList[0],
    newsBodyList: [testNewsBodyList[0], testNewsBodyList[1], testNewsBodyList[2]],
  },
  {
    ...testNewsList[1],
    newsBodyList: [testNewsBodyList[3], testNewsBodyList[4]],
  },
]

export const testDashboardNews = {
  latestNews: [...testNewsArray],
  themedNews: {
    [NewsTheme.POLITICAL_MAP]: [testNewsArray[1]],
    [NewsTheme.ECONOMY]: [testNewsArray[0]],
    [NewsTheme.PUBLIC_INTEREST]: [],
    [NewsTheme.SCIENCE_AND_EDUCATION]: [],
    [NewsTheme.CULTURAL_SPACE]: [],
  },
  analyticalNews: [],
  mainNews: [testNewsArray[1]],
}

export async function newsSeed(knex: Knex, elastic?: Elastic): Promise<void> {
  if (elastic) {
    // TODO: rewrite it to bulk
    for (const newsEntity of testNewsArray) {
      const newsBody = newsEntity.newsBodyList
        .map((news: NewsBody) => `${news.title} ${news.body}`)
        .join(' ')

      const body: NewsIndex = {
        uid: newsEntity.uid,
        authorName: journalistData.uid,
        tags: newsEntity.tags,
        status: newsEntity.status,
        section: newsEntity.section,
        theme: newsEntity.theme,
        publishedAt: newsEntity.publishedAt,
        hasPollLink: newsEntity.pollUID ? true : false,
        newsBody,
      }

      await elastic.index(newsEntity.uid, EntityNames.news, body)
    }
  }
  await knex('news').insert(testNewsList)
  await knex('news_body').insert(testNewsBodyList)
}

export async function newsSeedCleanup(knex: Knex): Promise<void> {
  await knex('news_body').del()
  await knex('news').del()
  await knex('index_task').del()
}
