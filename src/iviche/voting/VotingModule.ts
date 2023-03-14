import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { VoteDAOImpl } from './db/VoteDAOImpl'
import { VotingRoundDAOImpl } from './db/VotingRoundDAOImpl'
import { VoteServiceImpl } from './service/VoteServiceImpl'
import { VotingRoundServiceImpl } from './service/VotingRoundServiceImpl'

export class VoteModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('VotingRoundDAO', VotingRoundDAOImpl)
    container.registerSingleton('VotingRoundService', VotingRoundServiceImpl)
    container.registerSingleton('VoteDAO', VoteDAOImpl)
    container.registerSingleton('VoteService', VoteServiceImpl)
    logger.debug('app.context.poll.module.initialized')
  }
}
