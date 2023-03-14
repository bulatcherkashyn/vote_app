import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import {
  ForbiddenErrorCodes,
  NotFoundErrorCodes,
} from '../../../../../src/iviche/error/DetailErrorCodes'
import { Poll } from '../../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import {
  pollHiddenListSeed,
  testHiddenPollsList,
} from '../../../../database/seeds/TestPollHiddenList'
import { sleep } from '../../../../unit/utility/sleep'
import {
  administratorData,
  journalistData,
  moderatorData,
  regularUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController hide', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollHiddenListSeed])

    done()
  })

  test('GET to /polls. The Regular user cant see hidden polls in common list', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, active user (regular user) credentials
    // WHEN GET to /polls is done
    const response = await request(TestContext.app)
      .get(`/polls`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain poll with isHidden = false
    const NotHiddenPolls = testHiddenPollsList.filter(
      poll =>
        poll.isHidden === false &&
        poll.status !== PollStatus.DRAFT &&
        poll.status !== PollStatus.MODERATION &&
        poll.status !== PollStatus.REJECTED,
    )

    const expectedMetadata = { limit: 100, offset: 0, total: NotHiddenPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls. The Moderator cant see hidden polls in common list', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, moderator credentials
    // WHEN GET to /polls is done
    const response = await request(TestContext.app)
      .get(`/polls`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain poll with isHidden = false
    const NotHiddenPolls = testHiddenPollsList.filter(
      poll => poll.isHidden === false && poll.status !== PollStatus.DRAFT,
    )

    const expectedMetadata = { limit: 100, offset: 0, total: NotHiddenPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls. The Administrator cant see hidden polls in common list', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, administrator credentials
    // WHEN GET to /polls is done
    const response = await request(TestContext.app)
      .get(`/polls`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain poll with isHidden = false
    const NotHiddenPolls = testHiddenPollsList.filter(poll => poll.isHidden === false)

    const expectedMetadata = { limit: 100, offset: 0, total: NotHiddenPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls with author filter. Any user can see his polls, including hidden', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, active user (author) credentials and author UID
    // WHEN GET to /poll with author filter is done
    const response = await request(TestContext.app)
      .get(`/polls?author=${journalistData.uid}`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND author can see his polls
    const journalistPolls = testHiddenPollsList.filter(
      poll => poll.authorUID === journalistData.uid,
    )
    const expectedMetadata = { limit: 100, offset: 0, total: journalistPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.authorUID).toBe(journalistData.uid)
    })

    // AND result also contain hidden polls
    const hiddenPolls = listPolls.filter(poll => poll.isHidden === true)
    expect(hiddenPolls.length).not.toBe(0)
  })

  test('GET to /polls with author filter. Another regualar user cannot see another users hidden polls', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, active user (regular user) credentials and author UID
    // WHEN GET to /poll with author filter is done
    const response = await request(TestContext.app)
      .get(`/polls?author=${journalistData.uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result does not contain hidden polls
    const journalistPolls = testHiddenPollsList.filter(
      poll =>
        poll.authorUID === journalistData.uid &&
        poll.isHidden === false &&
        poll.status !== PollStatus.DRAFT &&
        poll.status !== PollStatus.MODERATION &&
        poll.status !== PollStatus.REJECTED,
    )

    const expectedMetadata = { limit: 100, offset: 0, total: journalistPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.authorUID).toBe(journalistData.uid)
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls with author filter. The Moderator cannot see another users poll list with hidden polls', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, moderator credentials and author UID
    // WHEN GET to /poll with author filter is done
    const response = await request(TestContext.app)
      .get(`/polls?author=${journalistData.uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    const journalistPolls = testHiddenPollsList.filter(
      poll =>
        poll.authorUID === journalistData.uid &&
        poll.isHidden === false &&
        poll.status !== PollStatus.DRAFT,
    )

    // AND result does not contain hidden polls
    const expectedMetadata = { limit: 100, offset: 0, total: journalistPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.authorUID).toBe(journalistData.uid)
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls with author filter. The Administrator cannot see another users poll list with hidden polls', async () => {
    // NOTE: Waiting for indexing data in elastic #elastic4ever
    await sleep(5000)

    // GIVEN application, administrator credentials and author UID
    // WHEN GET to /poll with author filter is done
    const response = await request(TestContext.app)
      .get(`/polls?author=${journalistData.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result does not contain hidden polls
    const journalistPolls = testHiddenPollsList.filter(
      poll => poll.authorUID === journalistData.uid && poll.isHidden === false,
    )

    const expectedMetadata = { limit: 100, offset: 0, total: journalistPolls.length }
    expect(response.body.metadata).toStrictEqual(expectedMetadata)

    const listPolls: Array<Poll> = response.body.list
    listPolls.forEach(poll => {
      expect(poll.authorUID).toBe(journalistData.uid)
      expect(poll.isHidden).toBeFalsy()
    })
  })

  test('GET to /polls/:pollId. The Author can see his own hidden poll by UID', async () => {
    // GIVEN application, active user (author) credentials and pollUID
    // WHEN GET to /poll/:pollId is done
    const response = await request(TestContext.app)
      .get(`/polls/${testHiddenPollsList[2].uid}`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result contain hidden poll data
    expect(response.body.authorUID).toBe(journalistData.uid)
    expect(response.body.isHidden).toBeTruthy()
  })

  test('GET to /polls/:pollId. The Moderator can see any hidden poll by UID', async () => {
    // GIVEN application, moderator credentials and pollUID
    // WHEN GET to /poll/:pollId is done
    const response = await request(TestContext.app)
      .get(`/polls/${testHiddenPollsList[2].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result contain hidden poll data
    expect(response.body.authorUID).toBe(journalistData.uid)
    expect(response.body.isHidden).toBeTruthy()
  })

  test('GET to /polls/:pollId. The Administrator can see any hidden poll by UID', async () => {
    // GIVEN application, administrator credentials and pollUID
    // WHEN GET to /poll/:pollId is done
    const response = await request(TestContext.app)
      .get(`/polls/${testHiddenPollsList[2].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND result contain hidden poll data
    expect(response.body.authorUID).toBe(journalistData.uid)
    expect(response.body.isHidden).toBeTruthy()
  })

  test('GET to /polls/:pollId. Another regualar user cannot see another users hidden poll by UID', async () => {
    // GIVEN application, active user (not author) credentials and pollUID
    // WHEN GET to /poll/:pollId is done
    const response = await request(TestContext.app)
      .get(`/polls/${testHiddenPollsList[2].uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
      message: 'Poll cannot be found',
      source: 'poll',
    })
  })

  test('GET to /polls/:pollId/hide. The Administrator can hide a poll by UID', async () => {
    // GIVEN application, administrator credentials and pollUID
    const pollUID = testHiddenPollsList[4].uid
    // AND poll is not hidden
    const knex = container.resolve<Knex>('DBConnection')
    const checkPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(checkPollIsHidden.isHidden).toBeFalsy()

    // WHEN GET to /poll/:pollId/hide is done
    const response = await request(TestContext.app)
      .post(`/polls/${pollUID}/hide`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND poll was successfully hidden
    const secondCheckPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(secondCheckPollIsHidden.isHidden).toBeTruthy()

    // NOTE: revert changes
    await knex('poll')
      .update('isHidden', false)
      .where({ uid: pollUID })
  })

  test('GET to /polls/:pollId/hide. The Moderator can hide a poll by UID', async () => {
    // GIVEN application, moderator credentials and pollUID
    const pollUID = testHiddenPollsList[4].uid
    // AND poll is not hidden
    const knex = container.resolve<Knex>('DBConnection')
    const checkPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(checkPollIsHidden.isHidden).toBeFalsy()

    // WHEN GET to /poll/:pollId/hide is done
    const response = await request(TestContext.app)
      .post(`/polls/${pollUID}/hide`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND poll was successfully hidden
    const secondCheckPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(secondCheckPollIsHidden.isHidden).toBeTruthy()

    // NOTE: revert changes
    await knex('poll')
      .update('isHidden', false)
      .where({ uid: pollUID })
  })

  test('GET to /polls/:pollId/hide. The Author cannot hide own poll by UID', async () => {
    // GIVEN application, active user (author) credentials and pollUID
    const pollUID = testHiddenPollsList[4].uid
    // AND poll is not hidden
    const knex = container.resolve<Knex>('DBConnection')
    const checkPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(checkPollIsHidden.isHidden).toBeFalsy()

    // WHEN GET to /poll/:pollId/hide is done
    const response = await request(TestContext.app)
      .post(`/polls/${pollUID}/hide`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be forbidden
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })

    // AND poll was not hidden
    const secondCheckPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(secondCheckPollIsHidden.isHidden).toBeFalsy()
  })

  test('GET to /polls/:pollId/hide. The regular user cannot hide another users poll by ID', async () => {
    // GIVEN application, active user (not author) credentials and pollUID
    const pollUID = testHiddenPollsList[4].uid
    // AND poll is not hidden
    const knex = container.resolve<Knex>('DBConnection')
    const checkPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(checkPollIsHidden.isHidden).toBeFalsy()

    // WHEN GET to /poll/:pollId/hide is done
    const response = await request(TestContext.app)
      .post(`/polls/${pollUID}/hide`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be forbidden
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })

    // AND poll was not hidden
    const secondCheckPollIsHidden = await knex<Partial<Poll>>('poll')
      .select('poll.isHidden')
      .where({ uid: pollUID })
      .first()
    expect(secondCheckPollIsHidden.isHidden).toBeFalsy()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
