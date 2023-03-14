import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { NotificationStorageServiceImpl } from './services/NotificationStorageServiceImpl'

export class NotificationStorageModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('NotificationStorageService', NotificationStorageServiceImpl)
    logger.debug('app.context.notification-storage.module.initialized')
  }
}
