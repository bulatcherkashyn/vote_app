import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { NewsDAOImpl } from './db/NewsDAOImpl'
import { NewsServiceImpl } from './services/NewsServiceImpl'

export class NewsModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('NewsDAO', NewsDAOImpl)
    container.registerSingleton('NewsService', NewsServiceImpl)
    logger.debug('app.context.news.module.initialized')
  }
}
