import 'reflect-metadata'

import request from 'supertest'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../src/iviche/common/Theme'
import {
  ForbiddenErrorCodes,
  ValidationErrorCodes,
} from '../../../../../src/iviche/error/DetailErrorCodes'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { pollSeed } from '../../../../database/seeds/TestPollsList'
import { primeAdminData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import { pollsList } from './PollControllerHelper'

describe('PollController fail validation', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollSeed])
    done()
  })

  test('POST to /polls with incorrect data', async () => {
    // GIVEN application, superuser credentials and incorrect poll data (body field is undefined)
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }
    // WHEN request to /polls is done
    const response = await request(TestContext.app)
      .post('/polls')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be 400
    expect(response.status).toBe(400)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: '"body" is required',
      source: 'body',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('PUT to /polls/:pollId with incorrect data', async () => {
    // GIVEN application, superuser credentials and incorrect poll data (title is incorrect)
    const newPoll = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 123123,
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put('/polls/00000000-0000-0000-0000-000000000000')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(newPoll)

    // THEN response must be 400
    expect(response.status).toBe(400)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: '"title" must be a string',
      source: 'title',
      code: ValidationErrorCodes.FIELD_DATA_TYPE_VALIDATION_ERROR,
    })
  })

  test('PUT to /polls/:pollId with forbidden status in DB', async () => {
    // GIVEN application, superuser credentials and forbidden poll status in DB
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'title new answer', index: 0 },
        { uid: pollsList[3].answers.toArray()[0].uid, title: 'updated title', index: 1 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${pollsList[1].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be 403
    expect(response.status).toBe(403)
    // AND body should contain message
    expect(response.body).toStrictEqual({
      message: 'Forbidden',
      source: 'update-poll',
      code: ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
