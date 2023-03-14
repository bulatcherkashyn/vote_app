import { ApplicationError } from '../error/ApplicationError'
import { NotificationType } from '../notificationStorage/models/NotificationType'
import { NotificationPollData } from '../polls/models/NotificationPollData'
import { PollStatus } from '../polls/models/PollStatus'
import { PushNotification } from './models/PushNotification'

export abstract class PushNotificationBuilder {
  public static getChangePollStatusNotification(
    pollData: NotificationPollData,
    targetUserUid: string,
    firebaseDeviceToken: string,
  ): PushNotification {
    const pollStatusBodyMapper: Partial<Record<PollStatus, string>> = {
      [PollStatus.PUBLISHED]: 'було одобрено адміністрацією',
      [PollStatus.VOTING]: 'перейшло до етапу "Голосування"',
      [PollStatus.DISCUSSION]: 'перейшло до етапу "Обговорення"',
      [PollStatus.FINISHED]: 'перейшло до етапу "Закінчено"',
      [PollStatus.COMPLETED]: 'було завершено, можете ознайомитись із детальної статистикою',
      [PollStatus.REJECTED]: 'було відхилено адміністрацією',
    }

    if (!pollStatusBodyMapper[pollData.status]) {
      throw new ApplicationError(`Cannot procces poll with status: [${pollData.status}]`)
    }

    return {
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - ${pollStatusBodyMapper[pollData.status]}!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: firebaseDeviceToken,
      },
    }
  }

  public static getNewPollNotification(
    pollData: NotificationPollData,
    targetUserUid: string,
    firebaseDeviceToken: string,
  ): PushNotification {
    return {
      type: NotificationType.NEW_POLL,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Нове опитування',
          body: `Пропонуємо прийняти участь в новому опитуванні "${pollData.title}"!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.NEW_POLL,
        },
        token: firebaseDeviceToken,
      },
    }
  }
}
