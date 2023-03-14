import 'reflect-metadata'

import { ApplicationError } from '../../../src/iviche/error/ApplicationError'
import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import { NotificationPollData } from '../../../src/iviche/polls/models/NotificationPollData'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PushNotification } from '../../../src/iviche/pushNotification/models/PushNotification'
import { PushNotificationBuilder } from '../../../src/iviche/pushNotification/PushNotificationBuilder'

describe('Push notification builder', () => {
  test('Build ChangePollStatus push notification. Poll status [PUBLISHED]', () => {
    // GIVEN poll data with status PUBLISHED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Wake the **** up, Samurai',
      body: 'We have a city to burn',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000027',
      status: PollStatus.PUBLISHED,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000002077'
    // AND the device token of user device
    const deviceToken = '2020'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - було одобрено адміністрацією!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [VOTING]', () => {
    // GIVEN poll data with status VOTING
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.VOTING,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - перейшло до етапу "Голосування"!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [DISCUSSION]', () => {
    // GIVEN poll data with status DISCUSSION
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.DISCUSSION,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - перейшло до етапу "Обговорення"!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [FINISHED]', () => {
    // GIVEN poll data with status FINISHED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.FINISHED,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - перейшло до етапу "Закінчено"!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [COMPLETED]', () => {
    // GIVEN poll data with status COMPLETED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.COMPLETED,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - було завершено, можете ознайомитись із детальної статистикою!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [REJECTED]', () => {
    // GIVEN poll data with status REJECTED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.REJECTED,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - було відхилено адміністрацією!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [REJECTED]', () => {
    // GIVEN poll data with status REJECTED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.REJECTED,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getChangePollStatusNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.POLL_STATUS_CHANGE,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Оновлення статусу опитування',
          body: `Ваше опитування "${pollData.title}" - було відхилено адміністрацією!`,
        },
        data: {
          uid: pollData.uid as string,
          type: NotificationType.POLL_STATUS_CHANGE,
        },
        token: deviceToken,
      },
    })
  })

  test('Build ChangePollStatus push notification. Poll status [DRAFT]. This should not be', () => {
    // GIVEN poll data with status DRAFT
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.DRAFT,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    try {
      // WHEN build push notification
      PushNotificationBuilder.getChangePollStatusNotification(pollData, targetUserUid, deviceToken)
    } catch (error) {
      // THEN got error
      expect(error).toBeInstanceOf(ApplicationError)
      expect(error.message).toBe('Cannot procces poll with status: [DRAFT]')
    }
  })

  test('Build ChangePollStatus push notification. Poll status [MODERATION]. This should not be', () => {
    // GIVEN poll data with status MODERATION
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title',
      body: 'Simple body',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.MODERATION,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    try {
      // WHEN build push notification
      PushNotificationBuilder.getChangePollStatusNotification(pollData, targetUserUid, deviceToken)
    } catch (error) {
      // THEN got error
      expect(error).toBeInstanceOf(ApplicationError)
      expect(error.message).toBe('Cannot procces poll with status: [MODERATION]')
    }
  })

  test('Build NewPoll push notification', () => {
    // GIVEN poll data with status REJECTED
    const pollData: NotificationPollData = {
      uid: '00000000-aaaa-aaaa-bbbb-000000000001',
      title: 'Simple title for new poll',
      body: 'Simple body for new poll',
      authorUID: '00000000-aaaa-aaaa-bbbb-000000000010',
      status: PollStatus.DISCUSSION,
    }
    // AND the uid of the user who should receive the notification
    const targetUserUid = '00000000-aaaa-aaaa-bbbb-000000000005'
    // AND the device token of user device
    const deviceToken = 'deviceToken'

    // WHEN build push notification
    const result: PushNotification = PushNotificationBuilder.getNewPollNotification(
      pollData,
      targetUserUid,
      deviceToken,
    )

    // THEN got push notification
    expect(result).toStrictEqual({
      type: NotificationType.NEW_POLL,
      targetUserUid,
      referenceObjectId: pollData.uid as string,
      notificationPayload: {
        notification: {
          title: 'Нове опитування',
          body: `Пропонуємо прийняти участь в новому опитуванні "${pollData.title}"!`,
        },
        data: {
          uid: pollData.uid,
          type: NotificationType.NEW_POLL,
        },
        token: deviceToken,
      },
    })
  })
})
