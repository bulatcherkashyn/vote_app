import 'reflect-metadata'

import request from 'supertest'

import { NewsTheme } from '../../../../../src/iviche/news/model/NewsTheme'
import { newsSeed, testNewsList } from '../../../../database/seeds/TestNewsList'
import { sleep } from '../../../../unit/utility/sleep'
import { TestContext } from '../../../context/TestContext'

describe('NewsController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([newsSeed])

    done()
  })

  test('GET to /news successfully. With published at', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get(
      '/news?publishedAtEnd=2020-06-18&publishedAtStart=2020-05-11',
    )

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: 1 },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(
      el => el.publishedAt?.toISOString() === '2020-05-14T12:51:21.189Z',
    )

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
    expect(receivedNews.publishedAt).toBe('2020-05-14T12:51:21.189Z')
  })

  test('GET to /news successfully. With elastic search params', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?theme=ECONOMY')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: 1 },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(el => el.theme === NewsTheme.ECONOMY)

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
    expect(receivedNews.theme).toEqual(NewsTheme.ECONOMY)
  })

  test('GET to /news successfully. With search term param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?searchTerm=COOKIES')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: 1 },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(el => el.theme === NewsTheme.ECONOMY)

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
    expect(receivedNews.theme).toEqual(NewsTheme.ECONOMY)
  })

  test('GET to /news successfully. With tags param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?tags=hell')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 2 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: testNewsList.length },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(el => el.tags.includes('hell'))

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
  })

  test('GET to /news successfully. With exclTags param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?exclTags=yeah')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: 1 },
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    // AND news uid must match
    const expectNews = testNewsList.find(el => !el.tags.includes('yeah'))
    const receivedNews = response.body.list[0]
    expect(receivedNews.uid).toBe(expectNews?.uid)
  })

  test('GET to /news successfully. With tags and exclTags param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?tags=hell&exclTags=yeah')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: 1 },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(el => el.tags.includes('test'))

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
  })

  test('GET to /news successfully. With some tags and empty exclTags param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /news address
    const response = await request(TestContext.app).get('/news?tags=hell&exclTags=')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 2 news
    const expectResponse = {
      metadata: { limit: 100, offset: 0, total: testNewsList.length },
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectNews = testNewsList.find(el => el.tags.includes('hell'))

    const receivedNews = response.body.list[0]

    expect(receivedNews.uid).toBe(expectNews?.uid)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
