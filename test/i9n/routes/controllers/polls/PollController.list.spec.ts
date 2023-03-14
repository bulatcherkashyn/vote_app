import 'reflect-metadata'

import { List } from 'immutable'
import request from 'supertest'

import { Theme } from '../../../../../src/iviche/common/Theme'
import { ValidationErrorCodes } from '../../../../../src/iviche/error/DetailErrorCodes'
import { PagedList } from '../../../../../src/iviche/generic/model/PagedList'
import { Poll } from '../../../../../src/iviche/polls/models/Poll'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { pollSeed, testPollsList } from '../../../../database/seeds/TestPollsList'
import { sleep } from '../../../../unit/utility/sleep'
import { journalistData, primeAdminData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import { pollsList } from './PollControllerHelper'

describe('PollController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSeed])

    done()
  })

  test('GET to /polls successfully. With published at', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?publishedAtEnd=2020-01-18&publishedAtStart=2020-01-16')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 1 },
      list: List(pollsList),
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectPoll = pollsList.find(
      el => el.publishedAt?.toISOString() === '2020-01-17T13:43:30.212Z',
    )

    const receivedPoll = response.body.list[0]

    expect(expectPoll?.uid).toBe(receivedPoll.uid)
    expect(expectPoll?.body).toBe(receivedPoll.body)
    expect(expectPoll?.title).toBe(receivedPoll.title)
  })

  test('GET to /polls successfully. With elastic search params', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?theme=EDUCATION')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 1 },
      list: List(pollsList),
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectPoll = pollsList.find(el => el.theme === Theme.EDUCATION)

    const receivedPoll = response.body.list[0]

    expect(expectPoll?.uid).toBe(receivedPoll.uid)
    expect(expectPoll?.body).toBe(receivedPoll.body)
    expect(expectPoll?.title).toBe(receivedPoll.title)
  })

  test('GET to /polls successfully. With elastic search param. pollType=BLITZ', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?pollType=BLITZ')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // // THEN response must be successful
    expect(response.status).toBe(200)
    // // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 1 },
      list: List(pollsList),
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    const expectPoll = pollsList.find(el => el.pollType === PollType.BLITZ)

    const receivedPoll = response.body.list[0]

    expect(expectPoll?.uid).toBe(receivedPoll.uid)
    expect(expectPoll?.body).toBe(receivedPoll.body)
    expect(expectPoll?.title).toBe(receivedPoll.title)
  })

  test('GET to /polls successfully. With elastic search param. pollType=REGULAR', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?pollType=REGULAR')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // // THEN response must be successful
    expect(response.status).toBe(200)
    // // AND result must contain 6 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 6 },
      list: List(pollsList),
    }

    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    expect(response.body.list[0].uid).toBe(testPollsList[5].uid)
    expect(response.body.list[1].uid).toBe(testPollsList[4].uid)
  })

  test('GET to /polls successfully. With elastic search param. Where pollType is undefined', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?pollType=')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be fail
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"pollType" must be one of [REGULAR, BLITZ, RATING_MONITOR]',
      source: 'pollType',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('GET to /polls successfully. With search term param', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)
    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get('/polls?searchTerm=poll')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 2 },
      list: List(pollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    expect(response.body.list[0].uid).toBe(testPollsList[5].uid)
    expect(response.body.list[1].uid).toBe(testPollsList[4].uid)
  })

  test('GET to /polls successfully. With elastic search params. authorUID', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/polls?author=${journalistData.uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result must contain 5 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 5 },
      list: List(pollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    const listPolls: Array<Poll> = response.body.list

    listPolls.forEach(poll => {
      expect(poll.authorUID).toBe(journalistData.uid)
    })
  })

  test('GET to /polls successfully. With elastic search params. tags', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/polls?tags=xxx`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 1 },
      list: List(testPollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    // AND poll uid must match
    const expectPoll = testPollsList.find(el => el.tags.includes('xxx'))
    const receivedPoll: Poll = response.body.list[0]
    expect(receivedPoll.uid).toBe(expectPoll?.uid)
  })

  test('GET to /polls successfully. With elastic search params. exclTags', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const TAG_TO_EXCLUDE = 'xxx'
    const response = await request(TestContext.app)
      .get(`/polls?exclTags=${TAG_TO_EXCLUDE}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain expectedPolls.length polls
    const expectedPolls: Array<Poll> = testPollsList.filter(
      poll => !poll.tags?.toArray().includes(TAG_TO_EXCLUDE),
    )
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: expectedPolls.length },
      list: List(testPollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    // AND response polls uid must contains in expected polls
    const responsePolls: Array<Poll> = response.body.list
    const expectedPollsUids: Array<string> = expectedPolls.map((poll: Poll) => poll.uid || '')
    for (let i = 0; i < responsePolls.length; i++) {
      expect(expectedPollsUids).toContain(responsePolls[i]?.uid)
    }
  })

  test('GET to /polls successfully. With elastic search params. Some tags and exclTags params', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/polls?tags=xxx&exclTags=xxx`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 0 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 0 },
      list: List(testPollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    expect(response.body.list.length).toBe(0)
  })

  test('GET to /polls successfully. With elastic search params. Some tags and empty exclTags params', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/polls?tags=xxx&exclTags=`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result must contain 1 polls
    const expectResponse: PagedList<Poll> = {
      metadata: { limit: 100, offset: 0, total: 1 },
      list: List(testPollsList),
    }
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)

    // AND poll uid must match
    const expectPoll = testPollsList.find(el => el.tags.includes('xxx'))
    const receivedPoll: Poll = response.body.list[0]
    expect(receivedPoll.uid).toBe(expectPoll?.uid)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
