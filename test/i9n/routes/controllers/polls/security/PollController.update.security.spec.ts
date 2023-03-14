import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../../src/iviche/common/Theme'
import { AgeGroup } from '../../../../../../src/iviche/polls/models/AgeGroup'
import { PollStatus } from '../../../../../../src/iviche/polls/models/PollStatus'
import {
  pollSecuritySeed,
  testPollAnswer,
  testPollsListSecurity,
} from '../../../../../database/seeds/TestPollListSecurity'
import {
  administratorData,
  moderatorData,
  primeAdminData,
  publicUserData,
  regularUserData,
} from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'

describe('PollController. PUT to /polls/:pollId', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSecuritySeed])
    done()
  })
  test('Poll status is DRAFT. User - author of poll (draft === true)', async () => {
    // GIVEN application and user (author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[0].uid}?draft=true`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[0].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
    expect(check.body.title).toBe(pollData.title)
    expect(check.body.title).not.toBe(testPollsListSecurity[0].title)
  })

  test('Poll status is DRAFT. User - moderator (draft === true)', async () => {
    // GIVEN application and moderator credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[5].uid}?draft=true`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[5].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[5].title)
  })

  test('Poll status is DRAFT. User - another user (draft === true)', async () => {
    // GIVEN application and user (not author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[5].uid}?draft=true`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on changed
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[5].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[5].title)
  })

  test('Poll status is REJECTED. User - author of poll (draft === true)', async () => {
    // GIVEN application and user (author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      answers: [
        { uid: testPollAnswer[2].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[3].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[1].uid}?draft=true`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[1].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).not.toBe(PollStatus.REJECTED)
    expect(check.body.status).toBe(PollStatus.DRAFT)
    expect(check.body.title).toBe(pollData.title)
    expect(check.body.title).not.toBe(testPollsListSecurity[1].title)
  })

  test('Poll status is REJECTED. User - moderator (draft === true)', async () => {
    // GIVEN application and moderator credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[4].uid}?draft=true`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[4].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.REJECTED)
    expect(check.body.status).not.toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[4].title)
  })

  test('Poll status is REJECTED. User - another user (draft === true)', async () => {
    // GIVEN application and user (not author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[4].uid}?draft=true`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[4].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.REJECTED)
    expect(check.body.status).not.toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[4].title)
  })

  test('Poll status is MODERATION. User - author of poll (draft === true)', async () => {
    // GIVEN application and user (author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[2].uid}?draft=true`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)
    expect(check.body.status).not.toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[2].title)
  })

  test('Poll status is MODERATION. User - moderator (draft === true)', async () => {
    // GIVEN application and user (author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[2].uid}?draft=true`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)
    expect(check.body.status).not.toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[2].title)
  })

  test('Poll status is MODERATION. User - moderator (draft === true)', async () => {
    // GIVEN application and user (author) credentials
    // AND application, poll data for update
    const pollData = {
      theme: Theme.OTHER,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.FEMALE],
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { uid: testPollAnswer[0].uid, title: 'updated first title', index: 0 },
        { uid: testPollAnswer[1].uid, title: 'updated title', index: 1 },
        { title: 'title new answer', index: 2 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${testPollsListSecurity[2].uid}?draft=true`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain error message
    expect(response.body.message).toBe('Poll cannot be found')
    expect(response.body.code).toBe(404002)

    // AND check updated poll on change
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsListSecurity[2].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)
    expect(check.body.status).not.toBe(PollStatus.DRAFT)
    expect(check.body.title).not.toBe(pollData.title)
    expect(check.body.title).toBe(testPollsListSecurity[2].title)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
