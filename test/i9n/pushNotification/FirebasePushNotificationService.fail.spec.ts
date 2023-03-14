import 'reflect-metadata'

import { container } from 'tsyringe'

import { NotificationStorageUtility } from '../../../src/iviche/common/utils/NotificationStorageUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { ApplicationError } from '../../../src/iviche/error/ApplicationError'
import { Notification } from '../../../src/iviche/notificationStorage/models/Notification'
import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import { FirebasePushNotificationService } from '../../../src/iviche/pushNotification/services/FirebasePushNotificationService'
import {
  testDataForPushNotificationSeed,
  testPollsList,
} from '../../database/seeds/TestPushNotificationData'
import { sleep } from '../../unit/utility/sleep'
import { TestContext } from '../context/TestContext'

import SpyInstance = jest.SpyInstance

describe('Push Notification service', () => {
  let firebasePushNotificationService: FirebasePushNotificationService
  let notifyMethodSpy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([testDataForPushNotificationSeed])
    firebasePushNotificationService = container.resolve('FirebasePushNotificationService')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    notifyMethodSpy = jest.spyOn(firebasePushNotificationService as any, 'notify')
    done()
  })

  beforeEach(async done => {
    const elastic = container.resolve<Elastic>('Elastic')
    await elastic.clearAll()
    done()
  })

  test('Send NEW_POLL push notification. Error while sending', async () => {
    // GIVEN correct poll uid
    const newPollUIDs = [testPollsList[0].uid]
    // AND expected error object
    const expectedError = new Error('test message')
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      throw expectedError
    })

    try {
      // WHEN send push notification about new poll
      await firebasePushNotificationService.sendNotificationAboutNewPoll(newPollUIDs)
    } catch (error) {
      // THEN got application error
      expect(error).toBeInstanceOf(ApplicationError)
      // AND error message should be like this
      expect(error.message).toBe(
        `Something went wrong with firebase push notifications [${NotificationType.NEW_POLL}]. Error: ${expectedError.message}`,
      )
    }
    // AND wait for elastic work for result check
    await sleep(3000)
    // AND тothing should be saved in notification storage and sent to devices
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)
    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)
    expect(arrOfNotifications.length).toBe(0)
  })

  test('Send CHANGE_POLL_STATUS push notification. Error while sending', async () => {
    // GIVEN correct poll uid
    const newPollUIDs = [testPollsList[0].uid]
    // AND expected error object
    const expectedError = new Error('test message')
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      throw expectedError
    })

    try {
      // WHEN send push notification about poll status change
      await firebasePushNotificationService.sendNotificationChangePollStatus(newPollUIDs)
    } catch (error) {
      // THEN got application error
      expect(error).toBeInstanceOf(ApplicationError)
      // AND error message should be like this
      expect(error.message).toBe(
        `Something went wrong with firebase push notifications [${NotificationType.POLL_STATUS_CHANGE}]. Error: ${expectedError.message}`,
      )
    }
    // AND wait for elastic work for result check
    await sleep(3000)
    // AND тothing should be saved in notification storage and sent to devices
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)
    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)
    expect(arrOfNotifications.length).toBe(0)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
