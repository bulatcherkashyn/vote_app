import 'reflect-metadata'

import { container } from 'tsyringe'

import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { Notification } from '../../../src/iviche/notificationStorage/models/Notification'
import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import { NotificationStorageServiceImpl } from '../../../src/iviche/notificationStorage/services/NotificationStorageServiceImpl'
import {
  elasticNotificationSeed,
  testElasticNotificationList,
} from '../../database/seeds/TestElasticNotificationList'
import { sleep } from '../../unit/utility/sleep'
import { journalistData, regularUserData } from '../common/TestUtilities'
import { TestContext } from '../context/TestContext'

const elastic = new Elastic()

const notificationStorageService = new NotificationStorageServiceImpl(elastic)

describe('Notification storage service', () => {
  beforeAll(async done => {
    await TestContext.initialize([elasticNotificationSeed])
    await sleep(5000)
    done()
  })

  test('index', async () => {
    // GIVEN notification
    const createdAt = DateUtility.now()
    const notification: Notification = {
      uid: '00000000-aaaa-aaaa-bbbb-000000011111',
      message: 'test message 11111',
      type: NotificationType.POLL_STATUS_CHANGE,
      referenceUid: '00000000-aaaa-aaaa-bbbb-000000200110',
      targetUserUid: '00000000-aaaa-aaaa-bbbb-000000000027',
      createdAt: createdAt,
      isRead: false,
    }

    // WHEN save it
    await notificationStorageService.save(notification)

    // NOTE wait for elastic work
    await sleep(3000)

    // THEN notification is indexed
    const check: Array<Notification> = await notificationStorageService.search(
      notification.targetUserUid,
    )
    expect(check[0]).toStrictEqual({
      uid: notification.uid,
      message: notification.message,
      type: notification.type,
      referenceUid: notification.referenceUid,
      targetUserUid: notification.targetUserUid,
      createdAt: createdAt.toISOString(),
      isRead: notification.isRead,
    })
  })

  test('index multiple notifications', async () => {
    // GIVEN notifications
    const createdAt = DateUtility.now()
    const notifications: Array<Notification> = [
      {
        uid: '00000000-aaaa-aaaa-bbbb-000000001121',
        message: 'test message 1121',
        type: NotificationType.POLL_STATUS_CHANGE,
        referenceUid: '00000000-aaaa-aaaa-bbbb-000000200121',
        targetUserUid: '00000000-aaaa-aaaa-bbbb-000000000027',
        createdAt: createdAt,
        isRead: false,
      },
      {
        uid: '00000000-aaaa-aaaa-bbbb-000000001122',
        message: 'test message 11111',
        type: NotificationType.NEW_POLL,
        referenceUid: '00000000-aaaa-aaaa-bbbb-000000200122',
        targetUserUid: '00000000-aaaa-aaaa-bbbb-000000000027',
        createdAt: createdAt,
        isRead: false,
      },
    ]

    // WHEN saveMany notifications
    await notificationStorageService.saveMany(notifications)

    // NOTE wait for elastic work
    await sleep(3000)

    // THEN notifications is indexed
    const check: Array<Notification> = await notificationStorageService.search(
      notifications[0].targetUserUid,
    )
    expect(check[0].uid).toBe(notifications[0].uid)
    expect(check[1].uid).toBe(notifications[1].uid)
  })

  test('search', async () => {
    // GIVEN data for function params (targetUserUid, array of notification types)
    // AND Sorted expected data
    const nonSortedNotification = testElasticNotificationList.filter(
      el => el.targetUserUid === regularUserData.uid,
    )
    const sortedNotification = nonSortedNotification.sort(
      (a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime(),
    )

    // WHEN search was completed
    const result: Array<Notification> = await notificationStorageService.search(
      regularUserData.uid,
      100,
      [NotificationType.USER_ACCOUNT_UPDATE, NotificationType.VOTED_POLL_STATUS_CHANGE],
    )

    // THEN we got expected and sorted by elastic array of notifications
    expect(result.length).toBe(sortedNotification.length)
    for (let i = 0; i < result.length; i++) {
      expect(result[i].uid).toBe(sortedNotification[i].uid)
    }
  })

  test('search. Without notification types', async () => {
    // GIVEN data for function params (targetUserUid)
    // AND Sorted expected data
    const nonSortedNotification = testElasticNotificationList.filter(
      el => el.targetUserUid === regularUserData.uid,
    )
    const sortedNotification = nonSortedNotification.sort(
      (a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime(),
    )

    // WHEN search was completed
    const result: Array<Notification> = await notificationStorageService.search(regularUserData.uid)

    // THEN we got expected and sorted by elastic array of notifications
    expect(result.length).toBe(sortedNotification.length)
    for (let i = 0; i < result.length; i++) {
      expect(result[i].uid).toBe(sortedNotification[i].uid)
    }
  })

  test('search. With one notification type', async () => {
    // GIVEN data for function params (targetUserUid, array of notification types)
    // AND Sorted expected data
    const nonSortedNotification = testElasticNotificationList.filter(
      el =>
        el.targetUserUid === regularUserData.uid &&
        el.type === NotificationType.USER_ACCOUNT_UPDATE,
    )
    const sortedNotification = nonSortedNotification.sort(
      (a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime(),
    )

    // WHEN search was completed
    const result: Array<Notification> = await notificationStorageService.search(
      regularUserData.uid,
      100,
      [NotificationType.USER_ACCOUNT_UPDATE],
    )

    // THEN we got expected and sorted by elastic array of notifications
    expect(result.length).toBe(sortedNotification.length)
    for (let i = 0; i < result.length; i++) {
      expect(result[i].uid).toBe(sortedNotification[i].uid)
    }
  })

  test('markAsRead. By targetUserUID with empty array of uids', async () => {
    // GIVEN user uid and empty array of uids
    const targetUserUid = journalistData.uid

    // WHEN change read status was completed
    await notificationStorageService.markAsRead(targetUserUid, [])

    // NOTE wait for elastic work
    await sleep(3000)

    // THEN nothing updated and get only one default notification with (isRead === true) from seed
    const esClient = container.resolve<Elastic>('Elastic')
    const check = await esClient.search<Notification>(EntityNames.notification)
    const arrOfNotifications = check.hits.map(el => el._source)

    const result = arrOfNotifications.filter(el => el.isRead === true)

    expect(result.length).toBe(1)

    // NOTE notification with (isRead === true) from seed
    expect(result[0].uid?.split('_').join('-')).toBe(testElasticNotificationList[6].uid)
  })
  test('markAsRead. By targetUserUID.', async () => {
    // GIVEN array of notification uids with 1 incorrect uid (not owner notification)
    const arrOfNotificationId = [
      testElasticNotificationList[0].uid as string,
      testElasticNotificationList[1].uid as string,
    ]
    // AND user uid
    const targetUserUid = journalistData.uid

    // WHEN change read status was completed
    await notificationStorageService.markAsRead(targetUserUid, arrOfNotificationId)

    // NOTE wait for elastic work
    await sleep(3000)

    // THEN we got expected only one document which was updated
    const esClient = container.resolve<Elastic>('Elastic')
    const check = await esClient.search<Notification>(EntityNames.notification)
    const arrOfNotifications = check.hits.map(el => el._source)

    const result = arrOfNotifications.filter(el => el.isRead === true)

    expect(result.length).toBe(2)

    // NOTE notification with (isRead === true) from seed
    expect(result[0].uid?.split('_').join('-')).not.toBe(arrOfNotificationId[1])

    expect(result[1].uid?.split('_').join('-')).toBe(arrOfNotificationId[0])
    expect(result[1].targetUserUid.split('_').join('-')).toBe(targetUserUid)
  })

  test('countUnread', async () => {
    // WHEN get unread notification
    const count = await notificationStorageService.countUnread(regularUserData.uid)

    // THEN we got expected count of documents which is unread
    expect(
      testElasticNotificationList.filter(
        el => el.isRead === false && el.targetUserUid === regularUserData.uid,
      ).length,
    ).toBe(count)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
