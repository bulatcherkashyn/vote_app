import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxUtility } from '../../db/TrxUtility'
import { logger } from '../../logger/LoggerFactory'
import { VotingRoundDAO } from '../db/VotingRoundDAO'
import { VotingRound } from '../model/VotingRound'
import { VotingRoundService } from './VotingRoundService'

@injectable()
export class VotingRoundServiceImpl implements VotingRoundService {
  constructor(
    @inject('VotingRoundDAO') protected dao: VotingRoundDAO,
    @inject('DBConnection') protected db: Knex,
  ) {}

  public async get(pollUID: string): Promise<VotingRound> {
    logger.debug('poll.voting-round.service.list.start')
    return TrxUtility.transactional<VotingRound>(this.db, async trxProvider => {
      const list = await this.dao.get(trxProvider, pollUID)
      logger.debug('poll.voting-round.service.list.done')
      return list
    })
  }
}
