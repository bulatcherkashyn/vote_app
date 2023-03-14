import { Notification } from '../../notificationStorage/models/Notification'

export class NotificationStorageUtility {
  public static formatFromElastic(notifications: Array<Notification>): Array<Notification> {
    return notifications.map(el => {
      return {
        ...el,
        uid: el.uid?.split('_').join('-'),
        targetUserUid: el.targetUserUid.split('_').join('-'),
        referenceUid: el.referenceUid?.split('_').join('-'),
      }
    })
  }

  public static formatToElastic(notification: Notification): Notification {
    return {
      ...notification,
      uid: notification.uid?.split('-').join('_'),
      targetUserUid: notification.targetUserUid.split('-').join('_'),
      referenceUid: notification.referenceUid?.split('-').join('_'),
    }
  }
}
