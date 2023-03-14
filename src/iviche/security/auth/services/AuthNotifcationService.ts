import { NotificationAuthData } from '../models/NotificationAuthData'

export interface AuthNotificationService {
  getAuthDataForNewPoll(): Promise<Array<NotificationAuthData>>

  getFirebaseDeviceTokens(userUIDs: Array<string>): Promise<Array<NotificationAuthData>>
}
