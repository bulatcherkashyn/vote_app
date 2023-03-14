import 'reflect-metadata'

import request from 'supertest'

import { Tag } from '../../../../../../src/iviche/tag/model/Tag'
import { tagSeeds, testTagData } from '../../../../../database/seeds/TestTagData'
import { moderatorData, regularUserData } from '../../../../common/TestUtilities'
import { TestContext } from '../../../../context/TestContext'

describe('Tag Controller. Get', () => {
  beforeAll(async done => {
    await TestContext.initialize([tagSeeds])
    done()
  })

  test('Get tags list. Moderator', async () => {
    // GIVEN application and moderator credentials
    // WHEN get tags list
    const response = await request(TestContext.app)
      .get('/tags')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
    const sortedTestTagData = testTagData.sort((a, b): number => {
      return (a.lastUseAt as Date) < (b.lastUseAt as Date) ? 1 : -1
    })
    // THEN equals test  tags
    expect(response.body.length).toBe(testTagData.length)
    const tags: Array<Tag> = response.body
    tags.forEach((el, idx) => {
      expect(el).toStrictEqual({
        ...sortedTestTagData[idx],
        lastUseAt: (testTagData[idx].lastUseAt as Date).toISOString(),
        createdAt: (testTagData[idx].createdAt as Date).toISOString(),
      })
    })
  })

  test('Get tags list. Regular user', async () => {
    // GIVEN application and regular user credentials
    // WHEN get tags list
    const response = await request(TestContext.app)
      .get('/tags')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
    const sortedTestTagData = testTagData.sort((a, b): number => {
      return (a.lastUseAt as Date) < (b.lastUseAt as Date) ? 1 : -1
    })
    // THEN equals test  tags
    expect(response.body.length).toBe(testTagData.length)
    const tags: Array<Tag> = response.body
    tags.forEach((el, idx) => {
      expect(el).toStrictEqual({
        ...sortedTestTagData[idx],
        lastUseAt: (testTagData[idx].lastUseAt as Date).toISOString(),
        createdAt: (testTagData[idx].createdAt as Date).toISOString(),
      })
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
