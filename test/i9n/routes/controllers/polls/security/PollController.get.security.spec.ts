import 'reflect-metadata'

import request from 'supertest'

import {
  pollSecuritySeed,
  testPollsListSecurity,
} from '../../../../../database/seeds/TestPollListSecurity'
import { moderatorData, publicUserData, regularUserData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'

describe('PollController. GET to /polls/:pollId', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSecuritySeed])
    done()
  })

  test('Poll status is DRAFT. User - author of poll', async () => {
    // GIVEN application and user (author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[0].uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[0].uid)
    expect(response.body.status).toBe(testPollsListSecurity[0].status)
    expect(response.body.title).toBe(testPollsListSecurity[0].title)
    expect(response.body.body).toBe(testPollsListSecurity[0].body)
  })

  test('Poll status is DRAFT. User - moderator', async () => {
    // GIVEN application and moderator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[0].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)
  })

  test('Poll status is DRAFT. User - another user', async () => {
    // GIVEN application and user (not author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[0].uid}`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)
  })

  test('Poll status is REJECTED. User - author of poll', async () => {
    // GIVEN application and user (author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[1].uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[1].uid)
    expect(response.body.status).toBe(testPollsListSecurity[1].status)
    expect(response.body.title).toBe(testPollsListSecurity[1].title)
    expect(response.body.body).toBe(testPollsListSecurity[1].body)
  })

  test('Poll status is REJECTED. User - moderator', async () => {
    // GIVEN application and moderator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[1].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[1].uid)
    expect(response.body.status).toBe(testPollsListSecurity[1].status)
    expect(response.body.title).toBe(testPollsListSecurity[1].title)
    expect(response.body.body).toBe(testPollsListSecurity[1].body)
  })

  test('Poll status is REJECTED. User - another user', async () => {
    // GIVEN application and user (not author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[1].uid}`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)
  })

  test('Poll status is MODERATION. User - author of poll', async () => {
    // GIVEN application and user (author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[2].uid)
    expect(response.body.status).toBe(testPollsListSecurity[2].status)
    expect(response.body.title).toBe(testPollsListSecurity[2].title)
    expect(response.body.body).toBe(testPollsListSecurity[2].body)
  })

  test('Poll status is MODERATION. User - moderator', async () => {
    // GIVEN application and moderator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[2].uid)
    expect(response.body.status).toBe(testPollsListSecurity[2].status)
    expect(response.body.title).toBe(testPollsListSecurity[2].title)
    expect(response.body.body).toBe(testPollsListSecurity[2].body)
  })

  test('Poll status is MODERATION. User - another user', async () => {
    // GIVEN application and user (not author) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)
  })

  test('Poll status is not DRAFT | REJECTED | MODERATION. User - independent user', async () => {
    // GIVEN application and user (any user) credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[3].uid}`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(testPollsListSecurity[3].uid)
    expect(response.body.status).toBe(testPollsListSecurity[3].status)
    expect(response.body.title).toBe(testPollsListSecurity[3].title)
    expect(response.body.body).toBe(testPollsListSecurity[3].body)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
