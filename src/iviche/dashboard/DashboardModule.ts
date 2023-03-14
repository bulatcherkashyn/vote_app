import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { DashboardServiceImpl } from './service/DashboardServiceImpl'

export class DashboardModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('DashboardService', DashboardServiceImpl)
    logger.debug('app.context.dashboard.module.initialized')
  }
}
