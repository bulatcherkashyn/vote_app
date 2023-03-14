import { NotificationType } from '../../notificationStorage/models/NotificationType'

type NotificationProperty = {
  title?: string
  body?: string
  imageUrl?: string
}

type DataProperty = {
  [key: string]: string
}

export interface PushNotificationPayload {
  notification?: NotificationProperty
  data?: DataProperty
  token: string
}

export interface PushNotification {
  type: NotificationType
  targetUserUid: string
  referenceObjectId: string
  notificationPayload: PushNotificationPayload
  device?: string
}
