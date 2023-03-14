import { Notification } from '../models/Notification'
import { NotificationType } from '../models/NotificationType'

export interface NotificationStorageService {
  save(notification: Notification): Promise<string>

  saveMany(notifications: Array<Notification>): Promise<void>

  search(
    targetUserUID: string,
    size?: number,
    notificationTypes?: Array<NotificationType>,
  ): Promise<Array<Notification>>

  countUnread(targetUserUID: string): Promise<number>

  markAsRead(userUID: string, UIDs?: Array<string>): Promise<void>
}
