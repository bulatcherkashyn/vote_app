import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { RatingMonitorDAOImpl } from './db/RatingMonitorDAOImpl'
import { RatingMonitorServiceImpl } from './services/RatingMonitorServiceImpl'

export class RatingMonitorModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('RatingMonitorDAO', RatingMonitorDAOImpl)
    container.registerSingleton('RatingMonitorService', RatingMonitorServiceImpl)
    logger.debug('app.context.rating-monitor.module.initialized')
  }
}
