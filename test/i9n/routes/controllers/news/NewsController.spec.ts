import 'reflect-metadata'

import request from 'supertest'

import { newsSeed } from '../../../../database/seeds/TestNewsList'
import { seed as personSeed } from '../../../../database/seeds/TestPersonsList'
import { sleep } from '../../../../unit/utility/sleep'
import { journalistData, publicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('NEWS', () => {
  beforeAll(async done => {
    await TestContext.initialize([personSeed, newsSeed])
    done()
  })

  test('GET news by uid', async () => {
    await sleep(5000) // 4elstic
    // WHEN get news by uid
    const response = await request(TestContext.app)
      .get(`/news/00000000-aaaa-aaaa-aaaa-000000000001`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response news and author data
    expect(response.status).toBe(200)
    expect(response.body.theme).toBeTruthy()
    expect(response.body.commentsCount).toBeDefined()
    expect(response.body.authorUID).toBeTruthy()
    expect(response.body.authorData.firstName).toBe('Lesya')
  })

  test('GET news by link', async () => {
    // WHEN get news by link
    const response = await request(TestContext.app)
      .get(`/news/alternativeLink-1`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
    // THEN response news and author data
    expect(response.status).toBe(200)
    expect(response.body.theme).toBeTruthy()
    expect(response.body.commentsCount).toBeDefined()
    expect(response.body.authorUID).toBeTruthy()
    expect(response.body.authorData.firstName).toBe('Lesya')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
