import 'reflect-metadata'

import { NotificationType } from '../../../src/iviche/notificationStorage/models/NotificationType'
import { NotificationStorageService } from '../../../src/iviche/notificationStorage/services/NotificationStorageService'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PollService } from '../../../src/iviche/polls/services/PollService'
import { PushNotification } from '../../../src/iviche/pushNotification/models/PushNotification'
import { PushNotificationBuilder } from '../../../src/iviche/pushNotification/PushNotificationBuilder'
import { FirebasePushNotificationService } from '../../../src/iviche/pushNotification/services/FirebasePushNotificationService'
import { AuthNotificationService } from '../../../src/iviche/security/auth/services/AuthNotifcationService'

import SpyInstance = jest.SpyInstance

const pollServiceMock: jest.Mock<PollService> = jest.fn()
const authNotificationServiceMock: jest.Mock<AuthNotificationService> = jest.fn()
const notificationStorageService: jest.Mock<NotificationStorageService> = jest
  .fn()
  .mockImplementation(() => {
    return {
      saveMany: jest.fn(),
    }
  })

const firebasePushNotificationService = new FirebasePushNotificationService(
  new pollServiceMock(),
  new authNotificationServiceMock(),
  new notificationStorageService(),
)

describe('Push notification service', () => {
  let notifyMethodSpy: SpyInstance

  beforeAll(async done => {
    notifyMethodSpy = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(firebasePushNotificationService as any, 'notify')

    done()
  })
  test('processPushNotifications function. Chunking', async () => {
    // GIVEN data for generating push notifications
    const pollData = {
      title: 'title',
      body: 'body',
      authorUID: '00000000-aaac-bbbb-cccc-000000000001',
      status: PollStatus.DISCUSSION,
    }
    const targetUserUid = '00000000-aaab-aaaa-aaaa-000000000033'
    const firrebaseDeviceToken = 'token'

    // AND generate 510 push notifications
    const pushNotifications: Array<PushNotification> = new Array(510).fill(
      PushNotificationBuilder.getNewPollNotification(pollData, targetUserUid, firrebaseDeviceToken),
    )

    // AND mock notify method
    notifyMethodSpy.mockImplementation(() => {
      return Promise.resolve({ responses: [] })
    })

    // WHEN process push notifications
    await firebasePushNotificationService['processPushNotifications'](
      pushNotifications,
      NotificationType.NEW_POLL,
    )

    // THEN got 2 chunk of data with size 500
    expect(notifyMethodSpy).toHaveBeenCalledTimes(2)
    expect(notifyMethodSpy.mock.calls[0][0].length).toBe(500)
    expect(notifyMethodSpy.mock.calls[1][0].length).toBe(10)
  })
})
