// import { messaging } from 'firebase-admin'
import * as admin from 'firebase-admin'

import { FirebasePushNotificationService } from '../../../src/iviche/pushNotification/services/FirebasePushNotificationService'

export class MockFirebasePushNotificationFunction {
  public static initialize(): void {
    const batchResponseMock: admin.messaging.BatchResponse = {
      responses: [],
      successCount: 0,
      failureCount: 0,
    }

    const mock = jest.fn(() => {
      return Promise.resolve(batchResponseMock)
    })

    FirebasePushNotificationService.prototype['notify'] = jest.fn(mock)
  }
}
