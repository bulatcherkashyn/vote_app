import 'reflect-metadata'

import request from 'supertest'

import { competencyTagsList } from '../../../../../src/iviche/common/CompetencyTag'
import { TestContext } from '../../../context/TestContext'

describe('CompetencyTag Controller .', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('Get Competency tags list', async () => {
    // GIVEN application and anonymous credentials
    // WHEN get Competency tags list
    const response = await request(TestContext.app).get('/competency-tags')

    // THEN got Competency tags list
    expect(response.body).toStrictEqual(competencyTagsList)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
