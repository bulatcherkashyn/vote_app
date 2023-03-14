import 'reflect-metadata'

import request from 'supertest'

import { PollType } from '../../../../../src/iviche/polls/models/PollType'
import { testIssueList, testIssueSeed } from '../../../../database/seeds/TestIssueList'
import { administratorData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('IssueController. GET', () => {
  beforeAll(async done => {
    await TestContext.initialize([testIssueSeed])
    done()
  })

  test('GET to /issues/:issueUid successfully (Type QUESTION). Issue from regular user', async () => {
    // GIVEN application and administrator credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      type: 'QUESTION',
      body: 'Is that the test question?',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: null,
      reference: null,
      userUID: '00000000-aaaa-aaaa-aaaa-000000000006',
      issuerEmail: null,
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {},
      authorData: {
        isLegalPerson: false,
        firstName: 'Maria',
        lastName: 'Zankovetska',
        shortName: null,
        avatar: null,
        email: 'maria.zankovetska@iviche.com',
      },
    }
    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[0].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type PROPOSAL). Issue from regular user', async () => {
    // GIVEN application and administrator credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000002',
      type: 'PROPOSAL',
      body: 'Lets hide all polls? For joke, 1st april',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: null,
      reference: null,
      userUID: '00000000-aaaa-aaaa-aaaa-000000000007',
      issuerEmail: null,
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {},
      authorData: {
        isLegalPerson: false,
        firstName: 'Vadym',
        lastName: 'Feoklistov',
        shortName: null,
        avatar: null,
        email: 'facebook.user@dewais.com',
      },
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[1].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type COMPLAINT). Issue from regular user', async () => {
    // GIVEN application and administrator credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000003',
      type: 'COMPLAINT',
      body: '???????????',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: 'poll',
      reference: '00000000-baaa-bbbb-cccc-000000000001',
      userUID: '00000000-aaaa-aaaa-aaaa-000000000007',
      issuerEmail: null,
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {
        uid: '00000000-baaa-bbbb-cccc-000000000001',
        theme: 'DOMESTIC_POLICY',
        complexWorkflow: false,
        anonymous: false,
        status: 'COMPLETED',
        title: 'title 1',
        body: 'test text 1',
        createdAt: null,
        publishedAt: '2020-01-13T13:43:30.212Z',
        discussionStartAt: null,
        votingStartAt: '2020-01-13T13:43:30.212Z',
        votingEndAt: '2020-01-15T13:43:30.212Z',
        tags: [],
        competencyTags: [],
        taAgeGroups: ['18-20'],
        taGenders: ['MALE', 'FEMALE'],
        taSocialStatuses: ['CLERK'],
        taAddressDistrict: null,
        taAddressRegion: 'KHARKIV_REGION',
        taAddressTown: null,
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000005',
        answersCount: 2,
        votesCount: 3,
        commentsCount: 0,
        isHidden: false,
        authorData: {
          isLegalPerson: false,
          firstName: 'Grigory',
          lastName: 'Skovoroda',
          shortName: null,
          avatar: null,
          email: 'grigory.skovoroda@iviche.com',
        },
        answers: [
          {
            pollUID: '00000000-baaa-bbbb-cccc-000000000001',
            uid: '00000000-aaab-bbbb-cccc-000000000001',
            basic: true,
            status: 'PUBLISHED',
            title: 'test1',
            createdAt: null,
            authorUID: '00000000-aaaa-aaaa-aaaa-000000000005',
            index: 0,
          },
          {
            pollUID: '00000000-baaa-bbbb-cccc-000000000001',
            uid: '00000000-aaab-bbbb-cccc-000000000002',
            basic: true,
            status: 'PUBLISHED',
            title: 'test2',
            createdAt: null,
            authorUID: '00000000-aaaa-aaaa-aaaa-000000000005',
            index: 1,
          },
        ],
        pollType: PollType.REGULAR,
        image: null,
      },
      authorData: {
        isLegalPerson: false,
        firstName: 'Vadym',
        lastName: 'Feoklistov',
        shortName: null,
        avatar: null,
        email: 'facebook.user@dewais.com',
      },
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[2].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type REQUEST). Issue from regular user', async () => {
    // GIVEN application and administrator credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000004',
      type: 'REQUEST',
      body: 'Request?',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: null,
      reference: null,
      userUID: '00000000-aaaa-aaaa-aaaa-000000000005',
      issuerEmail: null,
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {},
      authorData: {
        isLegalPerson: false,
        firstName: 'Grigory',
        lastName: 'Skovoroda',
        shortName: null,
        avatar: null,
        email: 'grigory.skovoroda@iviche.com',
      },
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[3].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type QUESTION). Issue from anonymous user', async () => {
    // GIVEN application and anonymous credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000005',
      type: 'QUESTION',
      body: 'Question from anon user',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: null,
      reference: null,
      userUID: null,
      issuerEmail: 'anonUser@iviche.com',
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {},
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[4].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type PROPOSAL). Issue from anonymous user', async () => {
    // GIVEN application and anonymous credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000006',
      type: 'PROPOSAL',
      body: 'Proposal from anon user',
      resolution: 'PENDING',
      comment: null,
      referenceObjectType: null,
      reference: null,
      userUID: null,
      issuerEmail: 'anonUser@iviche.com',
      createdAt: '2020-02-02T12:00:30.000Z',
      resolvedAt: null,
      moderatorUID: null,
      referencedObject: {},
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[5].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object
    expect(response.body).toStrictEqual(issue)
  })

  test('GET to /issues/:issueUid successfully (Type COMPLAINT). Issue from regular user. Already moderated issue', async () => {
    // GIVEN application and administrator credentials and issue object
    const issue = {
      uid: '00000000-aaaa-aaaa-cccc-000000000007',
      type: 'COMPLAINT',
      body: 'Артас нас предаст!',
      resolution: 'ANSWERED',
      comment: 'САМИ ЛЕСА ЛОРДЕРОНА ПРОШЕПТАЛИ ЕГО ИМЯ! ...',
      referenceObjectType: 'comment',
      reference: '00000001-baaa-bbbb-cccc-000000000001',
      userUID: '00000000-aaaa-aaaa-aaaa-000000000007',
      issuerEmail: null,
      createdAt: '2020-01-14T13:30:30.000Z',
      resolvedAt: '2020-01-15T09:00:00.000Z',
      moderatorUID: '00000000-aaaa-aaaa-aaaa-000000000004',
      referencedObject: {
        uid: '00000001-baaa-bbbb-cccc-000000000001',
        entityType: 'poll',
        entityUID: '00000000-baaa-bbbb-cccc-000000000001',
        threadUID: '00000001-baaa-bbbb-cccc-000000000001',
        parentUID: null,
        text: 'Люблю своего сына, Артаса',
        likesCounter: 0,
        dislikesCounter: 0,
        ratedBy: {},
        reports: {},
        createdAt: '2020-01-14T13:00:30.000Z',
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000006',
        authorData: {
          isLegalPerson: false,
          firstName: 'Maria',
          lastName: 'Zankovetska',
          shortName: null,
          avatar: null,
          email: 'maria.zankovetska@iviche.com',
        },
      },
      authorData: {
        isLegalPerson: false,
        firstName: 'Vadym',
        lastName: 'Feoklistov',
        shortName: null,
        avatar: null,
        email: 'facebook.user@dewais.com',
      },
    }

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .get(`/issues/${testIssueList[6].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain issue object with referencedObject and author data
    expect(response.body).toStrictEqual(issue)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
