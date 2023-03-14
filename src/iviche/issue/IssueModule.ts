import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { IssueDAOImpl } from './db/IssueDAOImpl'
import { IssueServiceImpl } from './service/IssueServiceImpl'

export class IssueModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('IssueDAO', IssueDAOImpl)
    container.registerSingleton('IssueService', IssueServiceImpl)
    logger.debug('app.context.issue.module.initialized')
  }
}
