import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../../src/iviche/common/utils/DateUtility'
import { CompetencyTagService } from '../../../../../src/iviche/competencyTag/service/CompetencyTagService'
import { Elastic } from '../../../../../src/iviche/elastic/Elastic'
import { ValidationErrorCodes } from '../../../../../src/iviche/error/DetailErrorCodes'
import { Moderation } from '../../../../../src/iviche/moderation/model/Moderation'
import { ModerationType } from '../../../../../src/iviche/moderation/model/ModerationType'
import { Person } from '../../../../../src/iviche/person/model/Person'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../../../src/iviche/polls/models/PollAnswer'
import { PollIndex } from '../../../../../src/iviche/polls/models/PollIndex'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import {
  pollSeed,
  testModerationCases,
  testPollsList,
  votingResults,
} from '../../../../database/seeds/TestPollsList'
import {
  administratorData,
  journalistData,
  legalUserData,
  limitedPublicUserData,
  primeAdminData,
  publicUserData,
  regularUserData,
  suspendedPublicUserData,
  veryfiedPublicUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'
import { pollsList } from './PollControllerHelper'

describe('PollController successful', () => {
  let competencyTagService: CompetencyTagService
  let flatCompetencyTagList: Array<string>

  beforeAll(async done => {
    await TestContext.initialize([pollSeed])
    competencyTagService = container.resolve<CompetencyTagService>('CompetencyTagService')
    flatCompetencyTagList = competencyTagService.getFlattenCompetencyTagsList()

    done()
  })

  test('POST to /polls successfully as DRAFT (draft === true). User systemStatus === ACTIVE', async () => {
    // GIVEN application, active user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls successfully as RATING MONITOR (status === RATING_MONITOR). User systemStatus === ACTIVE', async () => {
    // GIVEN application, active user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in rating monitor poll valid',
      body: 'Test body in rating monitor poll valid, text text text text text',
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
      pollType: 'RATING_MONITOR',
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)
    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
    expect(check.body.votingEndAt).toBe(null)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls successfully as DRAFT (draft === true). User systemStatus === SUSPENDED', async () => {
    // GIVEN application, suspended user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls successfully as DRAFT (draft === true). User systemStatus === LIMITED', async () => {
    // GIVEN application, limited user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // AND only one DEFAULT moderation case
    expect(checkModeration.body.list.length).toBe(1)
  })

  test('POST to /polls successfully as DRAFT (draft === true), Check Elastic data', async done => {
    // GIVEN application, superuser credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic MacOneLove poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND indexed by elastic
    const elastic = container.resolve<Elastic>('Elastic')
    setTimeout(async () => {
      const query = {
        wildcard: { title: { value: '*maconelove*' } },
      }
      const elasticData = await elastic.search<PollIndex>('poll', query)
      const { hits } = elasticData
      expect(elasticData.total.value).toBe(1)
      const data = hits[0]._source
      expect(data.body).toEqual('Test body in basic poll valid, text text text text text')
      expect(data.theme).toEqual('OTHER')
      expect(data.title).toEqual('Test title in basic MacOneLove poll valid')
      expect(data.tags).toEqual('')
      expect(data.competencyTags).toEqual('')
      done()
    }, 5000)
  }, 10000)

  test('POST to /polls successfully as MODERATION (draft === false)', async () => {
    // GIVEN application, regular user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      title: 'Test title in basic poll valid draft - false',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK],
      taAddressRegion: Region.KHARKIV_REGION,
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

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status MODERATION
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)

    const checkModeratoin = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkModeratoin.body.list[1].summary).toBe(pollData.title)

    // AND author person isPublicPerson status has changed to true
    const knex = container.resolve<Knex>('DBConnection')
    const checkPersonIsPublic = await knex<Partial<Person>>('person')
      .select('isPublicPerson')
      .where({ uid: regularUserData.personUID })
      .first()
    expect(checkPersonIsPublic?.isPublicPerson).toBeTruthy()
  })
  test('POST to /polls successfully as MODERATION (draft === false - by default)', async () => {
    // GIVEN application, regular user credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      title: 'Test title in basic poll valid draft - false',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK],
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status MODERATION
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)

    const checkModeratoin = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkModeratoin.body.list[1].summary).toBe(pollData.title)

    // AND author person isPublicPerson status has changed to true
    const knex = container.resolve<Knex>('DBConnection')
    const checkPersonIsPublic = await knex<Partial<Person>>('person')
      .select('isPublicPerson')
      .where({ uid: regularUserData.personUID })
      .first()
    expect(checkPersonIsPublic?.isPublicPerson).toBeTruthy()
  })

  test('GET to /polls/:pollId successfully', async () => {
    // GIVEN application and administrator credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsList[1].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.uid).toBe(pollsList[1].uid)
    expect(response.body.title).toBe(pollsList[1].title)
    expect(response.body.body).toBe(pollsList[1].body)

    const answersArray: Array<PollAnswer> = response.body.answers
    const expectedAnswersArray: Array<PollAnswer> = pollsList[1].answers.toArray()

    answersArray.forEach((answer: PollAnswer, index: number) => {
      expect(answer.uid).toBe(expectedAnswersArray[index].uid)
      expect(answer.title).toBe(expectedAnswersArray[index].title)
      expect(answer.authorUID).toBe(expectedAnswersArray[index].authorUID)
    })
  })

  test('GET to /polls/:pollId successfully with moderation info (Poll status === rejected)', async () => {
    // GIVEN application and administrator credentials
    // WHEN request is done to /polls/:pollId url
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsList[2].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain rejected poll's data with moderation info
    expect(response.body.uid).toBe(pollsList[2].uid)
    expect(response.body.title).toBe(pollsList[2].title)
    expect(response.body.body).toBe(pollsList[2].body)
    expect(response.body.moderationInfo).toStrictEqual({
      summary: testModerationCases[0].summary,
      resolvedAt: testModerationCases[0].resolvedAt?.toISOString(),
      concern: testModerationCases[0].concern,
    })

    const answersArray: Array<PollAnswer> = response.body.answers
    const expectedAnswersArray: Array<PollAnswer> = pollsList[2].answers.toArray()

    answersArray.forEach((answer: PollAnswer, index: number) => {
      expect(answer.uid).toBe(expectedAnswersArray[index].uid)
      expect(answer.title).toBe(expectedAnswersArray[index].title)
      expect(answer.authorUID).toBe(expectedAnswersArray[index].authorUID)
    })
  })

  test('PUT to /polls/:pollId successfully as DRAFT (draft === true)', async () => {
    // GIVEN application, poll data for update
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
        { uid: pollsList[2].answers.toArray()[0].uid, title: 'updated title', index: 1 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${pollsList[2].uid}?draft=true`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND check updated poll on status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsList[2].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
  })

  test('PUT to /polls/:pollId successfully as DRAFT (draft === true). PollType: Rating monitor', async () => {
    // GIVEN application, poll data for update
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
        { uid: pollsList[2].answers.toArray()[0].uid, title: 'updated title', index: 1 },
      ],
      pollType: PollType.RATING_MONITOR,
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${pollsList[7].uid}?draft=true`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND check updated poll on status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsList[7].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
  })

  test('PUT to /polls/:pollId successfully as DRAFT (draft === false by default)', async () => {
    // GIVEN application, poll data for update
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
        { uid: pollsList[3].answers.toArray()[0].uid, title: 'updated title', index: 1 },
      ],
    }

    // WHEN request to /polls/:pollId is done
    const response = await request(TestContext.app)
      .put(`/polls/${pollsList[3].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be successful with no content
    expect(response.status).toBe(204)

    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND check updated poll on status MODERATION
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsList[3].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.MODERATION)
  })

  test('GET to /polls/:pollId/statistics successfully', async () => {
    // GIVEN application and superuser credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsList[0].uid}/statistics`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data

    expect(response.body.toString()).toBe(votingResults.toString())
  })

  test('GET to /polls/:pollId - anonymous, completed poll', async () => {
    // GIVEN application and expected result
    const expectedResult = {
      ...testPollsList[0],
      votingStartAt: DateUtility.fromISO('2020-01-02').toISOString(),
      votingEndAt: DateUtility.fromISO('2020-01-15').toISOString(),
      taAddressRegion: Region.KHARKIV_REGION,
      createdAt: null,
      publishedAt: '2020-01-13T13:43:30.212Z',
      discussionStartAt: null,
      tags: ['xxx'],
      competencyTags: [],
      taAgeGroups: ['18-20'],
      taGenders: ['MALE', 'FEMALE'],
      taSocialStatuses: ['CLERK'],
      taAddressDistrict: null,
      taAddressTown: null,
      commentsCount: 0,
      isHidden: false,
      authorData: {
        avatar: null,
        firstName: 'Lesya',
        isLegalPerson: false,
        lastName: 'Ukrainka',
        shortName: null,
        email: 'lesya.ukrainka@iviche.com',
      },
      answers: [
        {
          pollUID: '00000000-baaa-bbbb-cccc-000000000001',
          uid: '00000000-aaab-bbbb-cccc-000000000001',
          basic: true,
          status: 'PUBLISHED',
          title: 'test1',
          createdAt: null,
          authorUID: '00000000-aaaa-aaaa-aaaa-000000000003',
          index: 0,
        },
        {
          pollUID: '00000000-baaa-bbbb-cccc-000000000001',
          uid: '00000000-aaab-bbbb-cccc-000000000002',
          basic: true,
          status: 'PUBLISHED',
          title: 'test2',
          createdAt: null,
          authorUID: '00000000-aaaa-aaaa-aaaa-000000000003',
          index: 1,
        },
      ],
      pollType: PollType.REGULAR,
      image: null,
    }
    // WHEN request without auth token is done to /poll/:pollId
    const response = await request(TestContext.app).get(`/polls/${testPollsList[0].uid}`)

    // THEN response should be successfully
    expect(response.status).toBe(200)
    // AND body contain a poll
    expect(response.body).toStrictEqual(expectedResult)
  })

  test('DELETE to /polls/:pollId successfully', async () => {
    // GIVEN application, superuser credentials and poll uid to be deleted
    // WHEN DELETE to /polls/:pollId is done
    const response = await request(TestContext.app)
      .delete(`/polls/${testPollsList[2].uid}`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be successful with no content
    expect(response.status).toBe(204)
    // AND body should be empty
    expect(response.body).toStrictEqual({})

    // AND search by poll's uid should return nothing
    const deleteTest = await request(TestContext.app)
      .get(`/polls/${testPollsList[2].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(deleteTest.status).toBe(404)
  })

  test('GET to /polls/:pollId/statistics successfully', async () => {
    // GIVEN application and superuser credentials
    // WHEN request is done to /polls/:pollId address
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsList[0].uid}/statistics`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND body should contain poll's data
    expect(response.body.toString()).toBe(votingResults.toString())
  })

  test('POST to /polls successfully as DRAFT (existing competency tags)', async () => {
    // GIVEN application, superuser credentials and new poll data
    const pollData = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      competencyTags: [flatCompetencyTagList[0], flatCompetencyTagList[1]],
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: [SocialStatus.CLERK],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taAddressRegion: Region.KHARKIV_REGION,
      answers: [
        { title: 'test1', index: 0 },
        { title: 'test2', index: 1 },
      ],
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
  })

  test('POST to /polls successfully as DRAFT (one not existing competency tag)', async () => {
    // GIVEN application, superuser credentials and new poll data
    const pollData = {
      competencyTags: ['ЗаАльянс', flatCompetencyTagList[0]],
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic MacOneLove poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(400)
    // AND body should contain error message
    expect(response.body).toStrictEqual({
      message: '"competencyTags[0]" does not match any of the allowed types',
      source: 'competencyTags.0',
      code: ValidationErrorCodes.UNKNOWN_VALIDATION_ERROR,
    })
  })

  test('POST to /polls successfully as DRAFT (not existing competency tags)', async () => {
    // GIVEN application, superuser credentials and new poll data
    const pollData = {
      competencyTags: ['ЗаАльянс', 'ВторойТэгНесущ'],
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      title: 'Test title in basic MacOneLove poll valid',
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

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/polls?draft=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .send(pollData)

    // THEN response must be not found
    expect(response.status).toBe(400)
    // AND body should contain error message
    expect(response.body).toStrictEqual({
      message: '"competencyTags[0]" does not match any of the allowed types',
      source: 'competencyTags.0',
      code: ValidationErrorCodes.UNKNOWN_VALIDATION_ERROR,
    })
  })

  test('POST to /polls/UID/answer successfully.', async () => {
    // GIVEN application, verifiedPublicUser credentials and new poll data
    const answer = { title: 'some new answer' }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[4].uid}/answers`)
      .set('Cookie', [`token=${veryfiedPublicUserData.jwtToken}`])
      .send(answer)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    const check = checkModeration.body.list.find(
      (el: Moderation) => el.summary === answer.title && el.type === ModerationType.POLL_ANSWER,
    )

    // AND only one default moderation case
    expect(check).not.toBeUndefined()
  })

  test('POST to /polls/UID/answer successfully as LEGAL user.', async () => {
    // GIVEN application, legalUser credentials and new poll data
    const answer = { title: 'some new answer' }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[4].uid}/answers`)
      .set('Cookie', [`token=${legalUserData.jwtToken}`])
      .send(answer)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    const checkModeration = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    const check = checkModeration.body.list.find(
      (el: Moderation) => el.summary === answer.title && el.type === ModerationType.POLL_ANSWER,
    )

    // AND only one default moderation case
    expect(check).not.toBeUndefined()
  })

  test('POST to /polls/:pollId/stop successfully as RATING MONITOR (status === RATING_MONITOR). User systemStatus === ACTIVE', async () => {
    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[7].uid}/stop`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send()
    expect(response.status).toBe(200)
    const check = await request(TestContext.app)
      .get(`/polls/${testPollsList[7].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send()
    expect(check.status).toBe(200)
    expect(check.body.pollType).toBe(PollType.RATING_MONITOR)
    expect(check.body.votingEndAt).toBe(null)
    expect(check.body.status).toBe(PollStatus.COMPLETED)
  })

  test('POST to /polls as DRAFT. PollType === RATING_MONITOR. image === undefined. User systemStatus === ACTIVE', async () => {
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
      .post('/polls?draft=true')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(pollData)

    // THEN response must be Created
    expect(response.status).toBe(201)
    // AND body should contain new poll's uid
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid).toHaveLength(36)

    // AND created Poll must have status DRAFT
    const check = await request(TestContext.app)
      .get(`/polls/${response.body.uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(check.body.status).toBe(PollStatus.DRAFT)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
