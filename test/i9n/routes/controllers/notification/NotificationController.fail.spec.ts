import 'reflect-metadata'

import request from 'supertest'

import { AuthErrorCodes } from '../../../../../src/iviche/error/DetailErrorCodes'
import { elasticNotificationSeed } from '../../../../database/seeds/TestElasticNotificationList'
import { sleep } from '../../../../unit/utility/sleep'
import { TestContext } from '../../../context/TestContext'

describe('NotificationController fail', () => {
  beforeAll(async done => {
    await TestContext.initialize([elasticNotificationSeed])
    await sleep(5000)
    done()
  })

  test('GET to /notifications anonymous', async () => {
    // GIVEN anonymous credentials
    // WHEN GET to /notifications is done
    const response = await request(TestContext.app).get('/notifications')

    // THEN response must be
    expect(response.status).toBe(401)

    expect(response.body).toStrictEqual({
      message: 'No auth token',
      source: 'token',
      code: AuthErrorCodes.NO_ACCESS_TOKEN,
    })
  })

  test('PUT to /notifications/markAsRead (all documents) anonymous', async () => {
    // GIVEN anonymous credentials
    // WHEN PUT to /notifications/markAsRead is done
    const response = await request(TestContext.app).put(`/notifications/markAsRead`)

    // THEN response must be
    expect(response.status).toBe(401)

    expect(response.body).toStrictEqual({
      message: 'No auth token',
      source: 'token',
      code: AuthErrorCodes.NO_ACCESS_TOKEN,
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
