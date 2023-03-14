import 'reflect-metadata'

import request from 'supertest'

import { commentSeed, testCommentData } from '../../../../database/seeds/TestCommentData'
import { regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('Comment controller create', () => {
  const endpoint = '/news/00000000-aaaa-aaaa-aaaa-000000000002/comments'
  beforeAll(async done => {
    await TestContext.initialize([commentSeed])
    done()
  })

  test('Create comment successfully. Without parentUID', async () => {
    // WHEN create a comment
    const response = await request(TestContext.app)
      .post(endpoint)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: "I'm first!!",
      })

    // Then comment uuid should be returned
    expect(response.status).toBe(200)
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid.length).toBe(36)
  })

  test('Create comment successfully. With parentUID', async () => {
    // WHEN create a comment
    const response = await request(TestContext.app)
      .post(endpoint)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: "It's no use for this elections",
        parentUID: testCommentData[2].uid,
      })

    // Then comment uuid should be returned
    expect(response.status).toBe(200)
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid.length).toBe(36)
  })

  test('Create comment failed. With non existed parentUID', async () => {
    // WHEN create a comment
    const response = await request(TestContext.app)
      .post(endpoint)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: "I'll hack your program 🧙‍♂️",
        parentUID: '00000001-baaa-bbbb-cccc-000000000008',
      })

    // Then should returned error
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Comment with this parentUID not found')
    expect(response.body.source).toBe('parentUID')
    expect(response.body.code).toBe(404002)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
