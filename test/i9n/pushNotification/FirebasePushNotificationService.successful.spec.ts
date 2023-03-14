import 'reflect-metadata'

import { FirebaseError, messaging } from 'firebase-admin'
import { container } from 'tsyringe'

import { FirebasePushNotificationService } from '../../../src/iviche/pushNotification/services/FirebasePushNotificationService'
import { auth, AuthDataSeed } from '../../database/seeds/TestAuthData'
import {
  testDataForPushNotificationSeed,
  testPollsList,
  usersList,
} from '../../database/seeds/TestPushNotificationData'
import { TestContext } from '../context/TestContext'
import SpyInstance = jest.SpyInstance
import { NotificationStorageUtility } from '../../../src/iviche/common/utils/NotificationStorageUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { Notification } from '../../../src/iviche/notificationStorage/models/Notification'
import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import { sleep } from '../../unit/utility/sleep'

describe('Push Notification service', () => {
  let firebasePushNotificationService: FirebasePushNotificationService
  let notifyMethodSpy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize([AuthDataSeed, testDataForPushNotificationSeed])
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

  test('Send NEW_POLL push notification. Poll status [DISCUSSION]', async () => {
    // GIVEN correct poll uid
    const newPollUIDs = [testPollsList[0].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [
        { success: true, messageId: 'someFirebaseMessageId1' },
        { success: true, messageId: 'someFirebaseMessageId2' },
      ],
      successCount: 3,
      failureCount: 0,
    }

    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about new poll
    await firebasePushNotificationService.sendNotificationAboutNewPoll(newPollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)
    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)
    const notificationsWithAuthorUID = arrOfNotifications.filter(
      it => it.targetUserUid === testPollsList[0].authorUID,
    )
    expect(arrOfNotifications.length).toBe(2)
    // AND there is no notifications with authorUID
    expect(notificationsWithAuthorUID.length).toBe(0)

    expect(arrOfNotifications[0].referenceUid).toBe(testPollsList[0].uid)
    expect(arrOfNotifications[0].type).toBe(NotificationType.NEW_POLL)

    expect(arrOfNotifications[0].targetUserUid).toBe(auth[1].uid)
    expect(arrOfNotifications[1].targetUserUid).toBe(usersList[1].uid)
  })
  test('Send NEW_POLL push notification. Poll status [VOTING]', async () => {
    // GIVEN correct poll uid
    const newPollUIDs = [testPollsList[1].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId' }],
      successCount: 3,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about new poll
    await firebasePushNotificationService.sendNotificationAboutNewPoll(newPollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)
    const notificationsWithAuthorUID = arrOfNotifications.filter(
      it => it.targetUserUid === testPollsList[0].authorUID,
    )
    expect(arrOfNotifications.length).toBe(1)
    // AND there is no notifications with authorUID
    expect(notificationsWithAuthorUID.length).toBe(0)

    expect(arrOfNotifications[0].referenceUid).toBe(testPollsList[1].uid)
    expect(arrOfNotifications[0].targetUserUid).not.toBe(testPollsList[1].authorUID)
    expect(arrOfNotifications[0].targetUserUid).toBe(auth[1].uid)
    expect(arrOfNotifications[0].type).toBe(NotificationType.NEW_POLL)
  })

  test('Send NEW_POLL push notification. For more than one user', async () => {
    // GIVEN correct poll uid
    const newPollUIDs = [testPollsList[7].uid]
    // AND expected data for firebase response mock with one unsuccessful object
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [
        { success: true, messageId: 'someFirebaseMessageId' },
        { success: false, error: { code: 'someCode', message: 'someMessage' } as FirebaseError },
      ],
      successCount: 1,
      failureCount: 1,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about new poll
    await firebasePushNotificationService.sendNotificationAboutNewPoll(newPollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(2)
    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].referenceUid).toBe(testPollsList[7].uid)
    expect(arrOfNotifications[0].targetUserUid).not.toBe(testPollsList[7].authorUID)
    expect(arrOfNotifications[0].targetUserUid).toBe(auth[1].uid)
    expect(arrOfNotifications[0].type).toBe(NotificationType.NEW_POLL)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[1].referenceUid).toBe(testPollsList[7].uid)
    expect(arrOfNotifications[1].targetUserUid).not.toBe(testPollsList[7].authorUID)
    expect(arrOfNotifications[1].targetUserUid).toBe(usersList[0].uid)
    expect(arrOfNotifications[1].type).toBe(NotificationType.NEW_POLL)
    expect(arrOfNotifications[1].isRead).toBeFalsy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [PUBLISHED]. 2 push notifications', async () => {
    // GIVEN correct poll uids
    const pollUIDs = [testPollsList[2].uid, testPollsList[3].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [
        { success: true, messageId: 'someFirebaseMessageId1' },
        { success: true, messageId: 'someFirebaseMessageId2' },
      ],
      successCount: 2,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(2)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[2].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()

    expect(arrOfNotifications[1].targetUserUid).toBe(testPollsList[3].authorUID)
    expect(arrOfNotifications[1].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[1].isRead).toBeTruthy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [DISCUSSION]', async () => {
    // GIVEN correct poll uid
    const pollUIDs = [testPollsList[0].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId1' }],
      successCount: 1,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(1)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[0].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [VOTING]', async () => {
    // GIVEN correct poll uid
    const pollUIDs = [testPollsList[1].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId1' }],
      successCount: 1,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(1)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[1].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [FINISHED]', async () => {
    // GIVEN correct poll uid
    const pollUIDs = [testPollsList[5].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId1' }],
      successCount: 1,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(1)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[4].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [COMPLETED]', async () => {
    // GIVEN correct poll uid
    const pollUIDs = [testPollsList[5].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId1' }],
      successCount: 1,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(1)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[5].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
  })
  test('Send CHANGE_POLL_STATUS push notification. Poll status [REJECTED]', async () => {
    // GIVEN correct poll uid
    const pollUIDs = [testPollsList[6].uid]
    // AND expected data for firebase response mock
    const expectedResponseFromFirebase: messaging.BatchResponse = {
      responses: [{ success: true, messageId: 'someFirebaseMessageId1' }],
      successCount: 1,
      failureCount: 0,
    }
    // AND mock notify method
    notifyMethodSpy.mockImplementationOnce(() => {
      return Promise.resolve(expectedResponseFromFirebase)
    })

    // WHEN send push notification about change poll status
    await firebasePushNotificationService.sendNotificationChangePollStatus(pollUIDs)

    // THEN wait for elastic work
    await sleep(3000)
    // AND notifications should have been sent to the users device and saved in the notification storage
    const elastic = container.resolve<Elastic>('Elastic')
    const check = await elastic.search<Notification>(EntityNames.notification)

    const arrOfNotificationsRaw = check.hits.map(el => el._source)
    const arrOfNotifications = NotificationStorageUtility.formatFromElastic(arrOfNotificationsRaw)

    expect(arrOfNotifications.length).toBe(1)

    // AND notification with successful response object should be saved with isRead = true
    expect(arrOfNotifications[0].targetUserUid).toBe(testPollsList[6].authorUID)
    expect(arrOfNotifications[0].type).toBe(NotificationType.POLL_STATUS_CHANGE)
    expect(arrOfNotifications[0].isRead).toBeTruthy()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
