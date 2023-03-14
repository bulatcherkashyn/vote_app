import 'reflect-metadata'

import request from 'supertest'

import { tagSeeds, testTagData } from '../../../../database/seeds/TestTagData'
import { administratorData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('Tag Controller', () => {
  beforeAll(async done => {
    await TestContext.initialize([tagSeeds])
    done()
  })

  test('Get tags list', async () => {
    const response = await request(TestContext.app).get('/tags')

    const tags = testTagData
      .sort((a, b): number => {
        return +(a.lastUseAt as Date) < +(b.lastUseAt as Date) ? 1 : -1
      })
      .map(el => {
        return {
          ...el,
          lastUseAt: el.lastUseAt && el.lastUseAt.toISOString(),
          createdAt: el.createdAt && el.createdAt.toISOString(),
        }
      })
    expect(response.body.length).toBe(testTagData.length)
    expect(response.body).toMatchObject(tags)
  })

  test('Create tag test', async () => {
    const tag = {
      value: 'test_tag',
    }

    const response = await request(TestContext.app)
      .post('/tags')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(tag)

    expect(response.status).toBe(201)
  })

  test('Update a tag', async () => {
    // GIVEN application and administrator data
    const updatedTag = {
      value: 'Brand_new_value',
    }

    // WHEN update tag
    const response = await request(TestContext.app)
      .put(`/tags/${testTagData[0].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send(updatedTag)
    // THEN status equal 204
    expect(response.status).toBe(204)
  })

  test('Delete a tag', async () => {
    const response = await request(TestContext.app)
      .delete(`/tags/${testTagData[0].uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])

    expect(response.status).toBe(204)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
