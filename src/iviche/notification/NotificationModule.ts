import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { NotificationServiceImpl } from './services/NotificationServiceImpl'

export class NotificationModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('NotificationService', NotificationServiceImpl)
    logger.debug('app.context.notification.module.initialized')
  }
}
