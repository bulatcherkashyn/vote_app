import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { CommentDAOImpl } from './db/CommentDAOImpl'
import { CommentServiceImpl } from './service/CommentServiceImpl'

export class CommentModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('CommentDAO', CommentDAOImpl)
    container.registerSingleton('CommentService', CommentServiceImpl)

    logger.debug('app.context.comment.module.initialized')
  }
}
