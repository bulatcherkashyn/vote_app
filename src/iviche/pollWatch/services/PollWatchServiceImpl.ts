import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxUtility } from '../../db/TrxUtility'
import { NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { GenericServiceImpl } from '../../generic/service/GenericServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { PollService } from '../../polls/services/PollService'
import { ACS } from '../../security/acs/models/ACS'
import { GrandAccessACS } from '../../security/acs/strategies'
import { PollWatchDAO } from '../db/PollWatchDAO'
import PollWatch from '../models/PollWatch'
import { PollWatchService } from './PollWatchService'

@injectable()
export class PollWatchServiceImpl extends GenericServiceImpl<PollWatch, PollWatchDAO>
  implements PollWatchService {
  constructor(
    @inject('PollWatchDAO') dao: PollWatchDAO,
    @inject('DBConnection') db: Knex,
    @inject('PollService') private pollService: PollService,
  ) {
    super(dao, db)
  }

  public async delete(uid: string): Promise<void> {
    logger.debug('pollWatch.service.delete.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.delete(trxProvider, uid)
      logger.debug('pollWatch.service.delete.done')
    })
  }

  public async save(entity: PollWatch, acs: ACS): Promise<string> {
    logger.debug('pollWatch.service.save.start')
    const relatedPoll = await this.pollService.get(entity.pollUID, new GrandAccessACS())
    if (!relatedPoll) {
      throw new ServerError(
        'Poll cannot be found',
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'poll',
      )
    }
    const objectWithPollTitle = { pollTitle: relatedPoll.title }
    const pollWatch = Object.assign(entity, objectWithPollTitle)
    return TrxUtility.transactional<string>(this.db, async trxProvider => {
      const uid = await this.dao.saveOrUpdate(trxProvider, pollWatch, acs)
      logger.debug('pollWatch.service.save.done')
      return uid
    })
  }
}
