import 'reflect-metadata'

import request from 'supertest'

import { TestContext } from '../../../context/TestContext'

describe('PollWatchController', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('POST to / without auth token', async () => {
    // GIVEN application and user data
    const pollData = {
      pollUID: '12313',
    }

    // WHEN request without auth token is done to /poll-watches
    const response = await request(TestContext.app)
      .post('/poll-watches')
      .send(pollData)

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('GET to / without auth token', async () => {
    // WHEN request without auth token is done to /poll-watches
    const response = await request(TestContext.app).get('/poll-watches')
    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('DELETE to /poll-watches/:id without auth token', async () => {
    // WHEN request without auth token is done to /poll-watches
    const response = await request(TestContext.app).delete('/poll-watches/1')
    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('DELETE to /poll-watches/:id with incorrect id', async () => {
    // WHEN request without auth token is done to /poll-watches
    const response = await request(TestContext.app).delete('/poll-watches/1')
    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
