import { List } from 'immutable'

import { TrxProvider } from '../../db/TrxProvider'
import { ApplicationError } from '../../error/ApplicationError'
import { ErrorCodes } from '../../error/ErrorCodes'
import { logger } from '../../logger/LoggerFactory'
import { StatisticsType } from '../../statistics/model/StatisticsType'
import { VotingResult } from '../../voting/model/VotingResult'
import { PollVotingResultDAO } from './PollVotingResultDAO'

export class PollVotingResultDAOImpl implements PollVotingResultDAO {
  public async cleanAnswerValueStatistics(
    trxProvider: TrxProvider,
    pollUID: string,
  ): Promise<void> {
    logger.debug('poll.voting-result.dao.clean-old-basic-statistics.start')
    const trx = await trxProvider()
    await trx('voting_result')
      .delete()
      .where({ votingRoundUID: pollUID, statisticsType: StatisticsType.ANSWER_VALUE })
    logger.debug('poll.voting-result.dao.clean-old-basic-statistics.done')
  }

  public async create(trxProvider: TrxProvider, votingResults: Array<VotingResult>): Promise<void> {
    logger.debug('poll.voting-result.dao.create.start')
    // FIXME: 50 answers * 24 regions
    if (votingResults.length < 1000) {
      const trx = await trxProvider()
      await trx('voting_result').insert(votingResults)
      logger.debug('poll.voting-result.dao.create.done')
    } else {
      logger.debug('poll.voting-result.dao.create.batch-too-big')
      throw new ApplicationError(
        `Batch size is [${votingResults.length}]`,
        ErrorCodes.BATCH_SIZE_ERROR,
      )
    }
  }

  public async list(trxProvider: TrxProvider, pollUID: string): Promise<List<VotingResult>> {
    logger.debug('poll.voting-result.dao.list.start')
    const trx = await trxProvider()

    const list = await trx<VotingResult>('voting_result').where({ votingRoundUID: pollUID })
    logger.debug('poll.voting-result.dao.list.done')

    return List(list)
  }
}
