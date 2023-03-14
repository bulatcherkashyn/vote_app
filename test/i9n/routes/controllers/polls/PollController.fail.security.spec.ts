import 'reflect-metadata'

import request from 'supertest'

import { testPollsList } from '../../../../database/seeds/TestPollsList'
import { limitedPublicUserData, suspendedPublicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('POST to /polls without auth token', async () => {
    // GIVEN application and user data
    const pollData = {
      title: 'title without token',
      body: ' bla bla text',
    }

    // WHEN request without auth token is done to /poll
    const response = await request(TestContext.app)
      .post('/polls')
      .send(pollData)

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('PUT to /polls/:pollId without auth token', async () => {
    // GIVEN application and user data
    const pollData = {
      title: 'title without token 2',
      body: ' bla bla text',
    }

    // WHEN request without auth token is done to /poll
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsList[0].uid}`)
      .send(pollData)

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('DELETE to /polls/:pollId without auth token', async () => {
    // GIVEN application and user data
    // WHEN request without auth token is done to /polls
    const response = await request(TestContext.app).delete(`/polls/${testPollsList[1].uid}`)

    // THEN response should be Unauthorized
    expect(response.status).toBe(401)
    // AND body contain a message
    expect(response.body.message).toBe('No auth token')
  })

  test('GET to /polls/:pollId - anonymous, draft poll', async () => {
    // GIVEN application
    // WHEN request without auth token is done to /poll/:pollId
    const response = await request(TestContext.app).get(`/polls/${testPollsList[0].uid}`)

    // THEN response should be NOT FOUND
    expect(response.status).toBe(404)
    // AND body contain a message
    expect(response.body).toStrictEqual({
      message: 'Poll cannot be found',
      source: 'poll',
      code: 404002,
    })
  })

  test('POST to /polls. Suspended user', async () => {
    // GIVEN application, suspended user data and poll data
    const pollData = {
      title: 'title without token',
      body: 'bla bla text',
    }

    // WHEN request to /polls is done
    const response = await request(TestContext.app)
      .post('/polls')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])
      .send(pollData)

    // THEN response should be Forbidden
    expect(response.status).toBe(403)
    // AND body contain a message
    expect(response.body.message).toBe('Access denied')
  })

  test('POST to /polls. Limited user', async () => {
    // GIVEN application, limited user data and poll data
    const pollData = {
      title: 'title without token',
      body: 'bla bla text',
    }

    // WHEN request to /polls is done
    const response = await request(TestContext.app)
      .post('/polls')
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])
      .send(pollData)

    // THEN response should be Forbidden
    expect(response.status).toBe(403)
    // AND body contain a message
    expect(response.body.message).toBe('Access denied')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
