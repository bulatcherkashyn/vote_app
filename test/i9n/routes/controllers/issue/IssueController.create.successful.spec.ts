import 'reflect-metadata'

import request from 'supertest'

import { Issue } from '../../../../../src/iviche/issue/model/Issue'
import { IssueReferenceType } from '../../../../../src/iviche/issue/model/IssueReferenceType'
import { IssueType } from '../../../../../src/iviche/issue/model/IssueType'
import { testIssueSeed, testPollsList } from '../../../../database/seeds/TestIssueList'
import { regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('IssueController. POST', () => {
  beforeAll(async done => {
    await TestContext.initialize([testIssueSeed])
    done()
  })

  test('POST to /issues successfully (Type QUESTION) regular user', async () => {
    // GIVEN application and regular user credentials and issue data with QUESTION type
    const issue: Partial<Issue> = {
      type: IssueType.QUESTION,
      body: 'Is that the test question?',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(issue)

    // THEN response must be created
    expect(response.status).toBe(201)
  })

  test('POST to /issues successfully (Type PROPOSAL) regular user', async () => {
    // GIVEN application and regular user credentials and issue data with PROPOSAL type
    const issue: Partial<Issue> = {
      type: IssueType.PROPOSAL,
      body: 'I have good idea for this case...',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(issue)

    // THEN response must be created
    expect(response.status).toBe(201)
  })

  test('POST to /issues successfully (Type COMPLAINT) regular user. Poll complaint', async () => {
    // GIVEN application and regular user credentials and issue data with COMPLAINT type
    const issue: Partial<Issue> = {
      type: IssueType.COMPLAINT,
      body: 'Poll complaint',
      reference: testPollsList[0].uid,
      referenceObjectType: IssueReferenceType.POLL,
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(issue)

    // THEN response must be created
    expect(response.status).toBe(201)
  })

  test('POST to /issues successfully (Type REQUEST) regular user', async () => {
    // GIVEN application and regular user credentials and issue data with REQUEST type
    const issue: Partial<Issue> = {
      type: IssueType.REQUEST,
      body: 'Help me, someone',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(issue)

    // THEN response must be created
    expect(response.status).toBe(201)
  })

  test('POST to /issues successfully (Type QUESTION) anonymous user', async () => {
    // GIVEN application and anonymous user credentials and issue data with QUESTION type
    const issue: Partial<Issue> = {
      type: IssueType.QUESTION,
      body: 'anon question',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues?issuerEmail=anon@iviche.com`)
      .send(issue)

    // THEN response must be created
    expect(response.status).toBe(201)
  })

  test('POST to /issues successfully (Type PROPOSAL) anonymous user', async () => {
    // GIVEN application and anonymous user credentials and issue data with PROPOSAL type
    const issue: Partial<Issue> = {
      type: IssueType.PROPOSAL,
      body: 'anon proposal',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues?issuerEmail=anon@iviche.com`)
      .send(issue)

    // THEN response must be successful
    expect(response.status).toBe(201)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
