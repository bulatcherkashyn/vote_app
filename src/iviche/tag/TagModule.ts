import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { TagDAOImpl } from './db/TagDAOImpl'
import { TagServiceImpl } from './service/TagServiceImpl'

export class TagModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('TagDAO', TagDAOImpl)
    container.registerSingleton('TagService', TagServiceImpl)

    logger.debug('app.context.tag.module.initialized')
  }
}
