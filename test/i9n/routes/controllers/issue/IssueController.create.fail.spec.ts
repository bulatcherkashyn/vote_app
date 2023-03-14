import 'reflect-metadata'

import request from 'supertest'

import { ForbiddenErrorCodes } from '../../../../../src/iviche/error/DetailErrorCodes'
import { Issue } from '../../../../../src/iviche/issue/model/Issue'
import { IssueReferenceType } from '../../../../../src/iviche/issue/model/IssueReferenceType'
import { IssueType } from '../../../../../src/iviche/issue/model/IssueType'
import { testIssueSeed, testPollsList } from '../../../../database/seeds/TestIssueList'
import { TestContext } from '../../../context/TestContext'

describe('IssueController. POST. FAIL', () => {
  beforeAll(async done => {
    await TestContext.initialize([testIssueSeed])
    done()
  })

  test('POST to /issues fail (Type COMPLAINT) anonymous user', async () => {
    // GIVEN application and anonymous user credentials and issue data with COMPLAINT type
    const issue: Partial<Issue> = {
      type: IssueType.COMPLAINT,
      body: 'Poll complaint',
      reference: testPollsList[0].uid,
      referenceObjectType: IssueReferenceType.POLL,
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues?issuerEmail=anon@iviche.com`)
      .send(issue)
    // THEN response must be forbidden
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })
  })

  test('POST to /issues fail (Type REQUEST) anonymous user', async () => {
    // GIVEN application and anonymous user credentials and issue data with REQUEST type
    const issue: Partial<Issue> = {
      type: IssueType.REQUEST,
      body: 'REquest?',
    }

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .post(`/issues?issuerEmail=anon@iviche.com`)
      .send(issue)

    // THEN response must be forbidden
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
