import 'reflect-metadata'

import { List } from 'immutable'
import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { PagedList } from '../../../../../src/iviche/generic/model/PagedList'
import { Moderation } from '../../../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolve } from '../../../../../src/iviche/moderation/model/ModerationResolve'
import { ModerationType } from '../../../../../src/iviche/moderation/model/ModerationType'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { UserSystemStatus } from '../../../../../src/iviche/users/models/UserSystemStatus'
import {
  moderationPersonsList,
  testModerationArray,
  testModerationSeed,
} from '../../../../database/seeds/TestModerationList'
import { testModerationArray as testModerationCases } from '../../../../database/seeds/TestPollsListModeration'
import {
  pollModerationSeed,
  testPollsList,
} from '../../../../database/seeds/TestPollsListModeration'
import { administratorData, moderatorData, primeAdminData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('ModerationController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([testModerationSeed, pollModerationSeed])
    done()
  })

  test('GET to /moderation-cases successfully. POLL', async () => {
    // GIVEN application and superuser credentials and object
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      type: 'poll',
      reference: '00000000-baaa-bbbb-cccc-000000000002',
      resolution: ModerationResolutionType.PENDING,
      concern: 'test',
      lockingCounter: 0,
      createdAt: null,
      resolvedAt: null,
      summary: 'poll header 1',
      moderatorUID: '00000000-aaaa-aaaa-aaaa-000000000002',
      referencedObject: {
        anonymous: false,
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000006',
        body: 'test text 2',
        competencyTags: [],
        complexWorkflow: false,
        createdAt: null,
        discussionStartAt: null,
        publishedAt: '2100-08-18T00:00:00.000Z',
        status: 'MODERATION',
        taAddressDistrict: null,
        taAddressRegion: 'KHARKIV_REGION',
        taAddressTown: null,
        taAgeGroups: [],
        taGenders: [],
        taSocialStatuses: [],
        tags: ['test'],
        theme: 'EDUCATION',
        title: 'title 2',
        uid: '00000000-baaa-bbbb-cccc-000000000002',
        votingEndAt: '2100-08-20T00:00:00.000Z',
        votingStartAt: '2100-08-19T00:00:00.000Z',
        answersCount: 2,
        authorData: {
          avatar: null,
          firstName: 'Maria',
          isLegalPerson: false,
          lastName: 'Zankovetska',
          shortName: null,
          email: 'maria.zankovetska@iviche.com',
        },
        commentsCount: 0,
        isHidden: false,
        votesCount: 0,
        answers: [
          {
            authorUID: '00000000-aaaa-aaaa-aaaa-000000000003',
            basic: true,
            createdAt: null,
            index: 0,
            pollUID: '00000000-baaa-bbbb-cccc-000000000002',
            status: 'PUBLISHED',
            title: 'test3',
            uid: '00000000-aaab-bbbb-cccc-000000000003',
          },
          {
            authorUID: '00000000-aaaa-aaaa-aaaa-000000000003',
            basic: true,
            createdAt: null,
            index: 1,
            pollUID: '00000000-baaa-bbbb-cccc-000000000002',
            status: 'PUBLISHED',
            title: 'test4',
            uid: '00000000-aaab-bbbb-cccc-000000000004',
          },
        ],
        pollType: PollType.REGULAR,
        image: null,
      },
    }

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/moderation-cases/${testModerationArray[0].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must moderation case
    expect(response.body).toStrictEqual(moderationCase)
  })

  test('GET to /moderation-cases successfully. Person', async () => {
    // GIVEN application and superuser credentials and object
    const moderationCase = {
      referencedObject: {
        addressDistrict: null,
        addressLine1: null,
        addressLine2: null,
        addressRegion: 'KYIV_CITY_REGION',
        addressTown: null,
        addressZip: null,
        avatar: null,
        bio: null,
        birthdayAt: null,
        createdAt: '2019-11-27T13:43:30.212Z',
        deletedAt: null,
        email: 'testModeration@iviche.com',
        firstName: 'Test',
        gender: 'MALE',
        isLegalPerson: false,
        isPublicPerson: false,
        jobTitle: null,
        lastName: 'Moderation',
        legalName: null,
        middleName: null,
        phone: '+380440001199#1',
        shortName: null,
        socialStatus: 'CLERK',
        tagline: null,
        uid: '00000000-aaaa-aaaa-bbcc-000000000001',
      },
      uid: '00000000-aaaa-aaaa-cccc-000000000002',
      type: ModerationType.USER,
      reference: '00000000-aaaa-aaaa-bccc-000000000001',
      resolution: 'PENDING',
      concern: 'test2',
      lockingCounter: 0,
      summary: 'user registration',
      createdAt: null,
      resolvedAt: null,
      moderatorUID: '00000000-aaaa-aaaa-aaaa-000000000002',
    }

    // WHEN request is done to /polls address
    const response = await request(TestContext.app)
      .get(`/moderation-cases/${testModerationArray[1].uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual(moderationCase)
  })

  test('GET to /moderation-cases list successfully', async () => {
    const moderationCases = [...testModerationArray, ...testModerationCases]
    // GIVEN application and superuser credentials
    const expectResponse: PagedList<Moderation> = {
      metadata: { limit: 100, offset: 0, total: 6 },
      list: List(moderationCases),
    }
    // WHEN request is done to /moderation-cases address
    const response = await request(TestContext.app)
      .get('/moderation-cases')
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain 6 moderation
    expect(response.body.metadata).toStrictEqual(expectResponse.metadata)
    expect(response.body.list.length).toBe(moderationCases.length)
    response.body.list.forEach((element: Moderation, index: number) => {
      expect(element.uid).toBe(moderationCases[index].uid)
      expect(element.reference).toBe(moderationCases[index].reference)
      expect(element.resolution).toBe(moderationCases[index].resolution)
    })
  })

  test('PUT to /moderation-cases successfully POLL', async () => {
    // GIVEN application, superuser credentials and new moderation data
    const moderationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      resolution: ModerationResolutionType.APPROVED,
      concern: 'updated',
      lockingCounter: 0,
    }

    // AND no tags in database
    const knex = container.resolve<Knex>('DBConnection')
    const firstTagsCheck = await knex('tag').select('*')
    expect(firstTagsCheck.length).toEqual(0)

    // WHEN POST to /moderation-cases/:uid is done
    const response = await request(TestContext.app)
      .put('/moderation-cases/00000000-aaaa-aaaa-cccc-000000000001')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(moderationCase)

    // THEN response must be
    expect(response.status).toBe(200)

    const checkPoll = await request(TestContext.app)
      .get(`/polls/00000000-baaa-bbbb-cccc-000000000002`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkPoll.body.status).toBe(PollStatus.PUBLISHED)

    // AND tags were created in database
    const finalTagsCheck = await knex('tag').select('*')
    expect(finalTagsCheck.length).toEqual(1)
    expect(finalTagsCheck[0].value).toEqual('test')
  })

  test('PUT to /moderation-cases person successfully', async () => {
    // GIVEN application, superuser credentials and new moderation data
    const moderationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-cccc-000000000003',
      resolution: ModerationResolutionType.APPROVED,
      concern: 'updated',
      lockingCounter: 0,
    }

    // WHEN POST to /moderation-cases/:uid is done
    const response = await request(TestContext.app)
      .put(`/moderation-cases/${moderationCase.uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(moderationCase)

    // THEN response must be
    expect(response.status).toBe(200)

    // WHEN get to /user-profile/profiles is done
    const checkProfile = await request(TestContext.app)
      .get(`/user-profile/profiles/${moderationPersonsList[1].email}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])

    // THEN response must be successful
    expect(checkProfile.status).toBe(200)
    expect(checkProfile.body.user.systemStatus).toBe(UserSystemStatus.ACTIVE)
  })

  test('PUT to /moderation-cases successfully POLL_ANSWER', async () => {
    // GIVEN application, superuser credentials and new moderation data
    const moderationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-cccc-000000000004',
      resolution: ModerationResolutionType.APPROVED,
      lockingCounter: 0,
    }

    // WHEN POST to /moderation-cases/:uid is done
    const response = await request(TestContext.app)
      .put('/moderation-cases/00000000-aaaa-aaaa-cccc-000000000004')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(moderationCase)

    // THEN response must be
    expect(response.status).toBe(200)

    const checkPoll = await request(TestContext.app)
      .get(`/polls/${testPollsList[4].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(checkPoll.body.answersCount).toBe(3)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
