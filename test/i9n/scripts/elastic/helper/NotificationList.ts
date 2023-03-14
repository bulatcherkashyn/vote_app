import { Notification } from '../../../../../src/iviche/notificationStorage/models/Notification'
import { NotificationType } from '../../../../../src/iviche/notificationStorage/models/NotificationType'

export const notifications: Array<Notification> = [
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000001121',
    message: 'test message 1121',
    type: NotificationType.POLL_STATUS_CHANGE,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000200121',
    targetUserUid: '00000000_aaaa_aaaa_aaaa_000000000006',
    createdAt: new Date(Date.parse('2021-05-06T00:00:00+0000')),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000001122',
    message: 'test message 11111',
    type: NotificationType.NEW_POLL,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000200122',
    targetUserUid: '00000000_aaaa_aaaa_aaaa_000000000006',
    createdAt: new Date(Date.parse('2021-04-06T00:00:00+0000')),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000001123',
    message: 'test message 11112',
    type: NotificationType.NEW_POLL,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000200122',
    targetUserUid: '00000000_aaaa_aaaa_aaaa_000000000006',
    createdAt: new Date(Date.parse('2021-03-06T00:00:00+0000')),
    isRead: false,
  },
  {
    uid: '00000000-aaaa-aaaa-bbbb-000000001124',
    message: 'test message 11114',
    type: NotificationType.NEW_POLL,
    referenceUid: '00000000-aaaa-aaaa-bbbb-000000200122',
    targetUserUid: '00000000_aaaa_aaaa_aaaa_000000000006',
    createdAt: new Date(Date.parse('2021-02-06T00:00:00+0000')),
    isRead: false,
  },
]
