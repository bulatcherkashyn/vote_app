import 'reflect-metadata'

import request from 'supertest'

import { commentSeed } from '../../../../database/seeds/TestCommentData'
import { regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import { expectCommentThread } from './commentHelper'

describe('Comment controller getThread', () => {
  const endpoint = '/news/00000000-aaaa-aaaa-aaaa-000000000002/comments'
  beforeAll(async done => {
    await TestContext.initialize([commentSeed])
    done()
  })

  test('Get comment thread successfully. With access token', async () => {
    const response = await request(TestContext.app)
      .get(endpoint)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    expectCommentThread(response)
  })

  test('Get comment thread successfully. Without access token', async () => {
    const response = await request(TestContext.app).get(endpoint)

    expectCommentThread(response)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
