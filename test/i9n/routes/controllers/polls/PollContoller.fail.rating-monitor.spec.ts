import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../src/iviche/common/Theme'
import {
  ForbiddenErrorCodes,
  NotFoundErrorCodes,
  ValidationErrorCodes,
} from '../../../../../src/iviche/error/DetailErrorCodes'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { pollSeed, testPollsList } from '../../../../database/seeds/TestPollsList'
import { administratorData, moderatorData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController Blitz fail', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSeed])

    done()
  })

  test('POST to /polls as MODERATION. PollType RATING_MONITOR. ComplexWorkflow false. By regular user', async () => {
    // GIVEN application, regular user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: null,
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: regularUserData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.RATING_MONITOR,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=false')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Forbidden
    expect(response.status).toBe(403)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      source: 'save-poll',
      code: ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls as MODERATION. PollType RATING_MONITOR. ComplexWorkflow false. By moderator', async () => {
    // GIVEN application, moderator credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: null,
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: moderatorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.RATING_MONITOR,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=false')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Forbidden
    expect(response.status).toBe(403)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      source: 'save-poll',
      code: ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls/:pollUID/stop. PollType RATING_MONITOR. ComplexWorkflow false. By regular user', async () => {
    // GIVEN application, user credentials and rating monitor uid
    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[7].uid}/stop`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send()
    // THEN response must be Forbidden
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls/:pollUID/stop. PollType REGULAR. ComplexWorkflow false. By administrator', async () => {
    // GIVEN application, user credentials and rating monitor uid
    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[0].uid}/stop`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send()
    // THEN response must be Forbidden
    expect(response.status).toBe(404)
    expect(response.body).toStrictEqual({
      message: 'Not found',
      source: 'rating-monitor',
      code: NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls as MODERATION. PollType === RATING_MONITOR. image === undefined. ComplexWorkflow false. By regular user', async () => {
    // GIVEN application, regular user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid text text text text text',
      body: 'Test body in basic poll valid, text text text text text text text  text ',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: null,
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.RATING_MONITOR,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=false')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Forbidden
    expect(response.status).toBe(403)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: 'Missing image. Image is a mandatory field for RATING MONITOR.',
      source: 'save-poll',
      code: ValidationErrorCodes.IMAGE_MISSING_ERROR,
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('PUT to /polls/:uid as MODERATION. PollType === RATING_MONITOR. image === undefined. ComplexWorkflow false. By regular user', async () => {
    // GIVEN application, regular user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid text text text text text',
      body: 'Test body in basic poll valid, text text text text text text text  text ',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: null,
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.RATING_MONITOR,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN PUT to /polls/:uid is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsList[7].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Forbidden
    expect(response.status).toBe(403)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: 'Missing image. Image is a mandatory field for RATING MONITOR.',
      source: 'save-poll',
      code: ValidationErrorCodes.IMAGE_MISSING_ERROR,
    })

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
