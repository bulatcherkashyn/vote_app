import { messaging } from 'firebase-admin'
import { inject, injectable } from 'tsyringe'

import { ApplicationError } from '../../error/ApplicationError'
import { logger } from '../../logger/LoggerFactory'
import { Notification } from '../../notificationStorage/models/Notification'
import { NotificationType } from '../../notificationStorage/models/NotificationType'
import { NotificationStorageService } from '../../notificationStorage/services/NotificationStorageService'
import { PollService } from '../../polls/services/PollService'
import { AuthNotificationService } from '../../security/auth/services/AuthNotifcationService'
import { PushNotification } from '../models/PushNotification'
import { PushNotificationBuilder } from '../PushNotificationBuilder'
import { PushNotificationService } from './PushNotificationService'

@injectable()
export class FirebasePushNotificationService implements PushNotificationService {
  constructor(
    @inject('PollService') private pollService: PollService,
    @inject('AuthNotificationService') private authNotificationService: AuthNotificationService,
    @inject('NotificationStorageService')
    private notificationStorageService: NotificationStorageService,
  ) {}

  private async notify(notifications: Array<messaging.Message>): Promise<messaging.BatchResponse> {
    return messaging().sendAll(notifications)
  }

  private async processPushNotifications(
    pushNotifications: Array<PushNotification>,
    notificationType: NotificationType,
  ): Promise<void> {
    const chunkSize = 500
    logger.debug(`processPushNotifications.pushNotifications: ${JSON.stringify(pushNotifications)}`)
    while (pushNotifications.length !== 0) {
      const chunk = pushNotifications.splice(0, chunkSize)

      const messagePayloads = chunk.map(pushNotification => pushNotification.notificationPayload)
      const { responses } = await this.notify(messagePayloads)

      logger.debug(`processPushNotifications.firebaseResponses: ${JSON.stringify(responses)}`)
      const notifications: Array<Notification> = []
      for (let i = 0; i < responses.length; i++) {
        const notification: Notification = {
          message: chunk[i].notificationPayload.notification?.body as string,
          type: notificationType,
          referenceUid: messagePayloads[i].data?.uid,
          targetUserUid: chunk[i].targetUserUid,
          isRead: responses[i].success,
        }
        notifications.push(notification)
      }
      logger.debug(`processPushNotifications.notifications: ${JSON.stringify(notifications)}`)
      await this.notificationStorageService.saveMany(notifications)
    }
  }

  public async sendNotificationChangePollStatus(pollUIDs: Array<string>): Promise<void> {
    try {
      const pollsData = await this.pollService.getPollsForNotification(pollUIDs)

      if (pollsData.length === 0) return

      const authorUIDs = pollsData.map(pollData => pollData.authorUID)
      const authorAuthData = await this.authNotificationService.getFirebaseDeviceTokens(authorUIDs)

      if (authorAuthData.length === 0) return

      const pushNotifications: Array<PushNotification> = []

      for (let i = 0; i < authorAuthData.length; i++) {
        for (let j = 0; j < pollsData.length; j++) {
          if (pollsData[j].authorUID === authorAuthData[i].userUid) {
            const notification = PushNotificationBuilder.getChangePollStatusNotification(
              pollsData[j],
              authorAuthData[i].userUid,
              authorAuthData[i].firebaseDeviceToken,
            )
            pushNotifications.push(notification)
          }
        }
      }

      await this.processPushNotifications(pushNotifications, NotificationType.POLL_STATUS_CHANGE)
    } catch (error) {
      throw new ApplicationError(
        `Something went wrong with firebase push notifications [${NotificationType.POLL_STATUS_CHANGE}]. Error: ${error.message}`,
      )
    }
  }

  public async sendNotificationAboutNewPoll(pollUIDs: Array<string>): Promise<void> {
    try {
      const pollsData = await this.pollService.getPollsForNotification(pollUIDs)

      if (pollsData.length === 0) return

      const authData = await this.authNotificationService.getAuthDataForNewPoll()
      logger.debug(`sendNotificationAboutNewPoll.authData: ${JSON.stringify(authData)}`)
      if (authData.length === 0) return

      const pushNotifications: Array<PushNotification> = []

      for (let i = 0; i < authData.length; i++) {
        for (let j = 0; j < pollsData.length; j++) {
          if (pollsData[j].authorUID !== authData[i].userUid) {
            const notification = PushNotificationBuilder.getNewPollNotification(
              pollsData[j],
              authData[i].userUid,
              authData[i].firebaseDeviceToken,
            )
            pushNotifications.push(notification)
          }
        }
      }

      await this.processPushNotifications(pushNotifications, NotificationType.NEW_POLL)
    } catch (error) {
      throw new ApplicationError(
        `Something went wrong with firebase push notifications [${NotificationType.NEW_POLL}]. Error: ${error.message}`,
      )
    }
  }
}
