import { container } from 'tsyringe'

import { FirebaseModule } from '../firebase/FirebaseModule'
import { logger } from '../logger/LoggerFactory'
import { FirebasePushNotificationService } from './services/FirebasePushNotificationService'

export class PushNotificationModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('FirebasePushNotificationService', FirebasePushNotificationService)
    FirebaseModule.initialize()

    logger.debug('app.context.push-notification.module.initialized')
  }
}
