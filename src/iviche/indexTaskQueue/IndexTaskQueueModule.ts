import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { IndexTaskQueueDAOImpl } from './db/IndexTaskQueueDAOImpl'
import { IndexTaskQueueServiceImpl } from './service/IndexTaskQueueServiceImpl'

export class IndexTaskQueueModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('IndexTaskQueueDAO', IndexTaskQueueDAOImpl)
    container.registerSingleton('IndexTaskQueueService', IndexTaskQueueServiceImpl)

    logger.debug('app.context.index-task-queue.module.initialized')
  }
}
