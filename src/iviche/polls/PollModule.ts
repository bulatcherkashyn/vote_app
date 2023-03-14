import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { PollDAOImpl } from './db/PollDAOImpl'
import { PollVotingResultDAOImpl } from './db/PollVotingResultDAOImpl'
import { PollServiceImpl } from './services/PollServiceImpl'
import { PollVotingResultServiceImpl } from './services/PollVotingResultServiceImpl'

export class PollModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('PollDAO', PollDAOImpl)
    container.registerSingleton('PollService', PollServiceImpl)
    container.registerSingleton('PollVotingResultDAO', PollVotingResultDAOImpl)
    container.registerSingleton('PollVotingResultService', PollVotingResultServiceImpl)
    logger.debug('app.context.poll.module.initialized')
  }
}
