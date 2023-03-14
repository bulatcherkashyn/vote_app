import 'reflect-metadata'

import request from 'supertest'

import { IssueResolution } from '../../../../../src/iviche/issue/model/IssueResolution'
import { IssueType } from '../../../../../src/iviche/issue/model/IssueType'
import { testIssueList, testIssueSeed } from '../../../../database/seeds/TestIssueList'
import { administratorData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('IssueController. LIST', () => {
  beforeAll(async done => {
    await TestContext.initialize([testIssueSeed])
    done()
  })

  test('GET to /issues where type in [QUESTION,PROPOSAL]', async () => {
    // GIVEN application and administrator credentials
    // AND expected list of issues
    const expectedIssues = testIssueList.filter(
      issue => issue.type === IssueType.QUESTION || issue.type === IssueType.PROPOSAL,
    )

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .get(`/issues?type=QUESTION,PROPOSAL`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body.list.length).toBe(expectedIssues.length)
  })

  test('GET to /issues where resolution in [ANSWERED]', async () => {
    // GIVEN application and administrator credentials
    // AND expected list of issues
    const expectedIssues = testIssueList.filter(
      issue => issue.resolution === IssueResolution.ANSWERED,
    )

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .get(`/issues?resolution=ANSWERED`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body.list.length).toBe(expectedIssues.length)
  })

  test('GET to /issues where resolution in [PENDING] and type in [QUESTION]', async () => {
    // GIVEN application and administrator credentials
    // AND expected list of issues
    const expectedIssues = testIssueList.filter(
      issue => issue.resolution === IssueResolution.PENDING && issue.type === IssueType.QUESTION,
    )

    // WHEN request is done to /issues address
    const response = await request(TestContext.app)
      .get(`/issues?resolution=PENDING&type=QUESTION`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)
    expect(response.body.list.length).toBe(expectedIssues.length)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
