import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { ModerationDAOImpl } from './db/ModerationDAOImpl'
import { ModerationServiceImpl } from './service/ModerationServiceImpl'

export class ModerationModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('ModerationDAO', ModerationDAOImpl)
    container.registerSingleton('ModerationService', ModerationServiceImpl)
    logger.debug('app.context.moderation.module.initialized')
  }
}
