import { List } from 'immutable'
import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxUtility } from '../../db/TrxUtility'
import { logger } from '../../logger/LoggerFactory'
import { VotingResult } from '../../voting/model/VotingResult'
import { PollVotingResultDAO } from '../db/PollVotingResultDAO'
import { PollVotingResultService } from './PollVotingResultService'

@injectable()
export class PollVotingResultServiceImpl implements PollVotingResultService {
  constructor(
    @inject('PollVotingResultDAO') protected dao: PollVotingResultDAO,
    @inject('DBConnection') protected db: Knex,
  ) {}

  public async cleanAnswerValueStatistics(pollUID: string): Promise<void> {
    logger.debug('poll.votingResult.service.cleanOldBasicStatistics.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.cleanAnswerValueStatistics(trxProvider, pollUID)
      logger.debug('poll.voting-result.service.cleanOldBasicStatistics.done')
    })
  }

  public async create(votingResults: Array<VotingResult>): Promise<void> {
    logger.debug('poll.votingResult.service.create.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.create(trxProvider, votingResults)
      logger.debug('poll.voting-result.service.create.done')
    })
  }

  public async list(pollUID: string): Promise<List<VotingResult>> {
    logger.debug('poll.voting-result.service.list.start')
    return TrxUtility.transactional<List<VotingResult>>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider, pollUID)
      logger.debug('poll.voting-result.service.list.done')
      return list
    })
  }
}
