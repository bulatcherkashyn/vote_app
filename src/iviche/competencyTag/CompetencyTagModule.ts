import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { CompetencyTagServiceImpl } from './service/CompetencyTagServiceImpl'

export class CompetencyTagModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

    logger.debug('app.context.competency-tag.module.initialized')
  }
}
