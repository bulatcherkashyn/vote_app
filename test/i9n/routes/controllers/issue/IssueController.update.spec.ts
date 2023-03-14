import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { IssueResolution } from '../../../../../src/iviche/issue/model/IssueResolution'
import { IssueResolve } from '../../../../../src/iviche/issue/model/IssueResolve'
import { testIssueList, testIssueSeed } from '../../../../database/seeds/TestIssueList'
import { administratorData, moderatorData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('IssueController. UPDATE', () => {
  beforeAll(async done => {
    await TestContext.initialize([testIssueSeed])
    done()
  })
  test('PUT to /issues/:issueUid Resolve issue of regular user. Resolution is ANSWERED', async () => {
    // GIVEN application and administrator credentials and issueResolve object
    const issueResolve: IssueResolve = {
      resolution: IssueResolution.ANSWERED,
      comment: 'Разумеется, сон - очень важен в жизни каждого человека!',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[0].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(issueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND issue must be updated
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[0].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(issueResolve.resolution)
    expect(issue.comment).toBe(issueResolve.comment)
  })

  test('PUT to /issues/:issueUid Resolve issue of regular user. Resolution is ACCEPTED', async () => {
    // GIVEN application and administrator credentials and issueResolve object
    const issueResolve: IssueResolve = {
      resolution: IssueResolution.ACCEPTED,
      comment: 'Request!',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[3].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(issueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND issue must be updated
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[3].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(issueResolve.resolution)
    expect(issue.comment).toBe(issueResolve.comment)
  })

  test('PUT to /issues/:issueUid Resolve issue of regular user. Resolution is REJECT', async () => {
    // GIVEN application and administrator credentials and issueResolve object
    const issueResolve: IssueResolve = {
      resolution: IssueResolution.REJECTED,
      comment: 'Bad body test',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[2].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(issueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND issue must be updated
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[2].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(issueResolve.resolution)
    expect(issue.comment).toBe(issueResolve.comment)
  })

  test('PUT to /issues/:issueUid Resolve issue of anonymous user. Resolution is ANSWERED', async () => {
    // GIVEN application and administrator credentials and issueResolve object
    const issueResolve: IssueResolve = {
      resolution: IssueResolution.ANSWERED,
      comment: 'Not anonymous answer',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[4].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(issueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND issue must be updated
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[4].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(issueResolve.resolution)
    expect(issue.comment).toBe(issueResolve.comment)
    expect(issue.userUID).toBeNull()
  })

  test('PUT to /issues/:issueUid Resolve issue of anonymous user. Resolution is ACCEPTED', async () => {
    // GIVEN application and administrator credentials and issueResolve object
    const issueResolve: IssueResolve = {
      resolution: IssueResolution.ACCEPTED,
      comment: 'oki-doki',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[5].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(issueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND issue must be updated
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[5].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(issueResolve.resolution)
    expect(issue.comment).toBe(issueResolve.comment)
    expect(issue.userUID).toBeNull()
  })

  test('PUT to /issues/:issueUid Resolve the same issue twice', async () => {
    // GIVEN application and administrator credentials
    // AND first issueResolve object for administrator
    const firstIssueResolve: IssueResolve = {
      resolution: IssueResolution.ACCEPTED,
      comment: 'First resolving',
    }
    // AND second issueResolve object for moderator
    const secondIssueResolve: IssueResolve = {
      resolution: IssueResolution.REJECTED,
      comment: 'Rejecting',
    }
    // AND db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN request is done to /issues/:issueId address
    const response = await request(TestContext.app)
      .put(`/issues/${testIssueList[1].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(firstIssueResolve)

    // THEN response must be successful
    expect(response.status).toBe(200)
    // AND second response must be not found
    const secondResponse = await request(TestContext.app)
      .put(`/issues/${testIssueList[1].uid}`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(secondIssueResolve)
    expect(secondResponse.status).toBe(404)

    // AND issue must be updated by the first resolving
    const issue = await knex('issue')
      .select('*')
      .where('uid', testIssueList[1].uid)
      .first()
    expect(issue.moderatorUID).toBe(administratorData.uid)
    expect(issue.resolution).toBe(firstIssueResolve.resolution)
    expect(issue.comment).toBe(firstIssueResolve.comment)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
