import { container } from 'tsyringe'

import { NotificationMessage } from '../../../src/iviche/notification/models/NotificationMessage'
import { Notifiers } from '../../../src/iviche/notification/models/Notifiers'
import { NotificationService } from '../../../src/iviche/notification/services/NotificationService'

class MockNotificationServiceImpl implements NotificationService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async notify(service: Notifiers, notification: NotificationMessage): Promise<void> {
    return
  }
}

export class MockNotificationModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('NotificationService', MockNotificationServiceImpl)
  }
}
