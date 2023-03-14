import 'reflect-metadata'

import request from 'supertest'

import { ForbiddenErrorCodes } from '../../../../../../src/iviche/error/DetailErrorCodes'
import { tagSeeds } from '../../../../../database/seeds/TestTagData'
import { administratorData, moderatorData, regularUserData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'

describe('Tag Controller. Create', () => {
  beforeAll(async done => {
    await TestContext.initialize([tagSeeds])
    done()
  })

  test('Create tag. Not administrator. Not moderator. Regular user', async done => {
    // GIVEN application and regular user data
    const createdTag = {
      value: 'created_tag',
    }

    // WHEN update  tag
    const response = await request(TestContext.app)
      .post(`/tags`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send(createdTag)

    // THEN status equal 403
    expect(response.status).toBe(403)
    expect(response.body).toStrictEqual({
      message: 'Access denied',
      code: ForbiddenErrorCodes.NO_ENOUGH_PERMISSIONS,
      source: 'acs',
    })
    done()
  })

  test('Create tag. Moderator', async done => {
    // GIVEN application and moderator data
    const createdTag = {
      value: 'created_test_tag',
    }

    // WHEN update  tag
    const response = await request(TestContext.app)
      .post(`/tags`)
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(createdTag)

    // THEN status equal 201
    expect(response.status).toBe(201)
    done()
  })

  test('Create tag. Administrator', async done => {
    // GIVEN application and administrator
    const createdTag = {
      value: 'created_tag',
    }

    // WHEN update  tag
    const response = await request(TestContext.app)
      .post(`/tags`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(createdTag)

    // THEN status equal 201
    expect(response.status).toBe(201)
    done()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
