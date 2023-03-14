import 'reflect-metadata'

import request from 'supertest'

import { Notification } from '../../../../../src/iviche/notificationStorage/models/Notification'
import {
  elasticNotificationSeed,
  testElasticNotificationList,
} from '../../../../database/seeds/TestElasticNotificationList'
import { sleep } from '../../../../unit/utility/sleep'
import { journalistData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('NotificationController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([elasticNotificationSeed])
    await sleep(5000)
    done()
  })

  test('GET to /notifications successfully', async () => {
    // GIVEN regularUser token for identify
    // WHEN GET to /notifications is done
    const response = await request(TestContext.app)
      .get('/notifications')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be
    expect(response.status).toBe(200)

    expect(response.body.length).toBe(4)
  })

  test('PUT to /notifications/markAsRead?uids=:uid...(by uids) successfully', async () => {
    // GIVEN journalist token for identify and uid of his notification
    // WHEN PUT to /notification/markAsRead?uids=:uid... is done
    const response = await request(TestContext.app)
      .put(`/notifications/markAsRead?uids=${testElasticNotificationList[0].uid}`)
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    // THEN response must be
    expect(response.status).toBe(200)

    // AND check that the notification has been updated
    const checkNotification = await request(TestContext.app)
      .get('/notifications')
      .set('Cookie', [`token=${journalistData.jwtToken}`])

    expect(checkNotification.body.length).toBe(1)
    expect(checkNotification.body[0].isRead).toBeTruthy()
  })

  test('PUT to /notifications/markAsRead (all documents) successfully', async () => {
    // GIVEN regularUser token for identify
    // WHEN PUT to /notification/markAsRead is done
    const response = await request(TestContext.app)
      .put(`/notifications/markAsRead`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    // THEN response must be
    expect(response.status).toBe(200)

    // AND check that the all notifications has been updated
    const checkNotification = await request(TestContext.app)
      .get('/notifications')
      .set('Cookie', [`token=${regularUserData.jwtToken}`])

    expect(checkNotification.body.length).toBe(4)

    checkNotification.body.forEach((notification: Notification) => {
      expect(notification.isRead).toBeTruthy()
    })
    expect(checkNotification.body[0].isRead).toBeTruthy()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
