import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../src/iviche/common/Theme'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { testPollsList } from '../../../../database/seeds/TestPollsList'
import {
  pollNotFoundSeed,
  testPollsListNotFound,
} from '../../../../database/seeds/TestPollsListNotFound'
import { moderatorData, primeAdminData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController fail not found', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollNotFoundSeed])
    done()
  })

  test('GET to /polls/:pollId not found', async () => {
    // GIVEN application and moderator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get('/polls/00000000-0000-0000-0000-000000000000')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain a message
    expect(response.body.message).toBe('Poll cannot be found')
  })

  test('GET to /polls/:pollId rejected poll without moderation case', async () => {
    // GIVEN application and moderator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsListNotFound[0].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain a message
    expect(response.body.message).toBe('Moderation case cannot be found')
  })

  test('PUT to /polls/:pollId not found', async () => {
    // GIVEN application, superuser credentials and poll data to be updated
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'title new answer', index: 0 },
        { title: 'title 2', index: 1 },
      ],
    }

    // WHEN request to /polls/:pollId is done with unexisting uuid
    const response = await request(TestContext.app)
      .put('/polls/00000000-0000-0000-0000-000000000000')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body should contain a message
    expect(response.body.message).toBe('Poll cannot be found')
  })

  test('DELETE to /polls/:pollId not found (non existing poll)', async () => {
    // GIVEN application, prime admin credentials and non existing poll uid to be deleted
    // WHEN DELETE to /polls/:pollId is done
    const response = await request(TestContext.app)
      .delete('/polls/00000000-0000-0000-0000-000000000000')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body message should state that poll cannot be found
    expect(response.body.message).toBe('Not found [poll] entity for delete')
  })

  test('DELETE to /polls/:pollId not found (not author)', async () => {
    // GIVEN application, regularUser (not author) credentials existing poll to be deleted
    // WHEN DELETE to /polls/:pollId is done
    const response = await request(TestContext.app)
      .delete(`/polls/${testPollsList[2].uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body message should state that poll cannot be found
    expect(response.body.message).toBe('Not found [poll] entity for delete')
  })

  test('DELETE to /polls/:pollId not found (poll status not in [DRAFT, REJECTED])', async () => {
    // GIVEN application, prime admin credentials and poll with wrong status to be deleted
    // WHEN DELETE to /polls/:pollId is done
    const response = await request(TestContext.app)
      .delete(`/polls/${testPollsList[1].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(404)
    // AND body message should state that poll cannot be found
    expect(response.body.message).toBe('Not found [poll] entity for delete')
  })

  test('GET to /polls/:pollId/statistics not found', async () => {
    // GIVEN application and superuser credentials
    // WHEN request is done to /polls/:pollId/statistics address
    const response = await request(TestContext.app)
      .get('/polls/00000000-0000-0000-0000-000000000000/statistics')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be not found
    expect(response.status).toBe(400)
    // AND body should contain a message
    expect(response.body.message).toBe(
      'Statistics for poll 00000000-0000-0000-0000-000000000000 is empty',
    )
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
