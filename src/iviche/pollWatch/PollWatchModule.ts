import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { PollWatchDAOImpl } from './db/PollWatchDAOImpl'
import { PollWatchServiceImpl } from './services/PollWatchServiceImpl'

export class PollWatchModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('PollWatchDAO', PollWatchDAOImpl)
    container.registerSingleton('PollWatchService', PollWatchServiceImpl)
    logger.debug('app.context.poll-watch.module.initialized')
  }
}
