import Knex from 'knex'

import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { Notification } from '../../../src/iviche/notificationStorage/models/Notification'
import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import {
  journalistData,
  moderatorData,
  publicUserData,
  regularUserData,
} from '../../i9n/common/TestUtilities'

// NOTE: For the best work we need to create interface for DB data instead of any
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testElasticNotificationList: Array<Notification> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000001',
    message: 'test message 0',
    type: NotificationType.POLL_MODERATION,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000001',
    targetUserUid: journalistData.uid,
    createdAt: DateUtility.fromISO('2020-01-01T12:00:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000002',
    message: 'test message 1',
    type: NotificationType.NEWS_AND_POLLS_DIGEST,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000002',
    targetUserUid: moderatorData.uid,
    createdAt: DateUtility.fromISO('2020-01-02T12:00:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000003',
    message: 'test message 2',
    type: NotificationType.NEWS_AND_POLLS_DIGEST,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000003',
    targetUserUid: publicUserData.uid,
    createdAt: DateUtility.fromISO('2020-01-02T16:30:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000004',
    message: 'test message 4',
    type: NotificationType.VOTED_POLL_STATUS_CHANGE,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000004',
    targetUserUid: regularUserData.uid,
    createdAt: DateUtility.fromISO('2020-02-02T14:30:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000005',
    message: 'test message 5',
    type: NotificationType.USER_ACCOUNT_UPDATE,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000005',
    targetUserUid: regularUserData.uid,
    createdAt: DateUtility.fromISO('2020-02-02T15:30:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000006',
    message: 'test message 6',
    type: NotificationType.USER_ACCOUNT_UPDATE,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000006',
    targetUserUid: regularUserData.uid,
    createdAt: DateUtility.fromISO('2020-06-06T12:00:00.000Z'),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000000007',
    message: 'test message 7',
    type: NotificationType.USER_ACCOUNT_UPDATE,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000000007',
    targetUserUid: regularUserData.uid,
    createdAt: DateUtility.fromISO('2020-02-03T12:00:00.000Z'),
    isRead: true,
  },
]

// NOTE knex has not been removed because it is required by the interface rules
export async function elasticNotificationSeed(knex: Knex, elastic?: Elastic): Promise<void> {
  const preparedDataForElastic = testElasticNotificationList.map(el => {
    return {
      ...el,
      uid: el.uid?.split('-', 5).join('_'),
      referenceUid: el.referenceUid?.split('-', 5).join('_'),
      targetUserUid: el.targetUserUid.split('-', 5).join('_'),
    }
  })
  if (elastic) {
    await elastic.bulk<Notification>(EntityNames.notification, preparedDataForElastic)
  }
}
