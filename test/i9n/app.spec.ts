import 'reflect-metadata'

import request from 'supertest'

import { TestContext } from './context/TestContext'

describe('main route', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('main route', async () => {
    const response = await request(TestContext.app).get('/')

    expect(response.status).toBe(200)
    expect(response.body.message).toBe('iViche Server!')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
