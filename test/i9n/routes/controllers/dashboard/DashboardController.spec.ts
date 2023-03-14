import 'reflect-metadata'

import request from 'supertest'

import { Language } from '../../../../../src/iviche/common/Language'
import { NewsSection } from '../../../../../src/iviche/news/model/NewsSection'
import { NewsTheme } from '../../../../../src/iviche/news/model/NewsTheme'
import { newsSeed } from '../../../../database/seeds/TestNewsList'
import { pollSeed } from '../../../../database/seeds/TestPollsList'
import { sleep } from '../../../../unit/utility/sleep'
import { publicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('DASHBOARD', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSeed, newsSeed])
    done()
  })

  test('GET', async () => {
    await sleep(5000) // 4elstic
    // WHEN get dashboard
    const response = await request(TestContext.app)
      .get(`/dashboard`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN all dashboard field should exist
    expect(response.status).toBe(200)
    expect(response.body.region).toBeDefined()
    expect(response.body.activeNationalPolls).toBeDefined()
    expect(response.body.activeLocalPolls).toBeDefined()
    expect(response.body.activePopularPolls).toBeDefined()
    expect(response.body.latestNationalNews).toBeDefined()
  })

  test('GET Dashboard News', async () => {
    await sleep(5000) // 4elstic
    // WHEN get dashboard news
    const response = await request(TestContext.app)
      .get(`/news-dashboard`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN all dashboard field should exist
    expect(response.status).toBe(200)

    expect(response.body.latestNews[0].newsBodyList.length).toBe(2)
    expect(response.body.themedNews[NewsTheme.ECONOMY].length).toBe(1)
    expect(response.body.themedNews[NewsTheme.POLITICAL_MAP].length).toBe(1)

    const multilanguageNews = response.body.latestNews[0].newsBodyList.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newsBody: any) =>
        newsBody.language === Language.RU ||
        newsBody.language === Language.UA ||
        newsBody.language === Language.EN,
    )
    expect(multilanguageNews).toBeTruthy()

    expect(response.body.mainNews.length).toBe(1)
    expect(response.body.mainNews[0].section).toEqual(NewsSection.MAIN)

    expect(response.body.analyticalNews).toBeDefined()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
