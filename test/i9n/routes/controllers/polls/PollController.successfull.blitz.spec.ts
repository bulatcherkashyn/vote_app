import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../src/iviche/common/Theme'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { pollSeed, testPollsList } from '../../../../database/seeds/TestPollsList'
import { administratorData, legalUserData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController Blitz successfull', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSeed])

    done()
  })

  test('POST to /polls as DRAFT. PollType BLITZ. ComplexWorkflow false. By administrator', async () => {
    // GIVEN application, regular user credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls?draft=true`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Successfull
    expect(response.status).toBe(201)
    expect(response.body.uid).toBeTruthy()

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('PUT to /polls as DRAFT. PollType BLITZ. ComplexWorkflow false. By administrator', async () => {
    // GIVEN application, moderator credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN PUT to /polls is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsList[6].uid}?draft=true`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)
    // THEN response must be Successfull
    expect(response.status).toBe(204)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls as MODERATION. PollType BLITZ. ComplexWorkflow false. By administrator', async () => {
    // GIVEN application, regular user credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
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

    // THEN response must be Successfull
    expect(response.status).toBe(201)

    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkModeration.body.list[1].summary).toBe(pollData.title)
  })

  test('PUT to /polls as MODERATION. PollType BLITZ. ComplexWorkflow false. By administrator', async () => {
    // GIVEN application, moderator credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: administratorData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsList[6].uid}?draft=false`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Successfull
    expect(response.status).toBe(204)
  })

  test('POST to /polls as MODERATION. PollType BLITZ. ComplexWorkflow false. By regular user', async () => {
    // GIVEN application, regular user credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: regularUserData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
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

    // THEN response must be Successfull
    expect(response.status).toBe(201)

    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkModeration.body.list[1].summary).toBe(pollData.title)
  })

  test('POST to /polls as MODERATION. PollType BLITZ. ComplexWorkflow false. By legal user', async () => {
    // GIVEN application, regular user credentials and new poll data
    // TODO: all genders, ageGroups and socialStatuses should be in a blitz poll
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: false,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: regularUserData.uid,
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.BLITZ,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=false')
      .set('Cookie', [`token=${legalUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Successfull
    expect(response.status).toBe(201)

    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkModeration.body.list[1].summary).toBe(pollData.title)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
