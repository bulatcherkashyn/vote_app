import * as esb from 'elastic-builder'
import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { PollUtility } from '../../common/PollUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { Elastic } from '../../elastic/Elastic'
import { EntityNames } from '../../elastic/EntityNames'
import { ForbiddenErrorCodes, NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { GenericServiceImpl } from '../../generic/service/GenericServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { ModerationDAO } from '../../moderation/db/ModerationDAO'
import { ModerationType } from '../../moderation/model/ModerationType'
import { PersonDAO } from '../../person/db/PersonDAO'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollService } from '../../polls/services/PollService'
import { ACS } from '../../security/acs/models/ACS'
import { RatingMonitorDAO } from '../db/RatingMonitorDAO'
import { RatingMonitor } from '../models/RatingMonitor'
import { RatingMonitorService } from './RatingMonitorService'

@injectable()
export class RatingMonitorServiceImpl extends GenericServiceImpl<RatingMonitor, RatingMonitorDAO>
  implements RatingMonitorService {
  constructor(
    @inject('DBConnection') db: Knex,
    @inject('RatingMonitorDAO') dao: RatingMonitorDAO,
    @inject('PersonDAO') private readonly personDao: PersonDAO,
    @inject('ModerationDAO') private readonly moderationDao: ModerationDAO,
    @inject('PollService') private readonly pollService: PollService,
    @inject('Elastic') private readonly elasticClient: Elastic,
  ) {
    super(dao, db)
  }

  public async savePoll(poll: RatingMonitor, saveAsDraft: boolean, acs: ACS): Promise<string> {
    logger.debug('rating-monitor.service.save-poll.start')
    return await TrxUtility.transactional<string>(this.db, async trxProvider => {
      if (poll.uid) {
        logger.debug('rating-monitor.service.save-poll.update.start')
        const existingPoll = await this.dao.get(trxProvider, poll.uid, acs)

        if (!existingPoll) {
          logger.debug('rating-monitor.service.save-poll.update.error.poll-does-not-exist')
          throw new ServerError(
            'Poll cannot be found',
            404,
            NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
            'update-poll',
          )
        }

        if (!PollUtility.verifyAllowedPollStatusForSave(existingPoll)) {
          logger.debug('rating-monitor.service.save-poll.update.error.forbidden-change-status')
          throw new ServerError(
            'Forbidden',
            403,
            ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
            'update-poll',
          )
        }
      }

      if (saveAsDraft) {
        return this.saveBasePoll(trxProvider, { ...poll, status: PollStatus.DRAFT }, acs)
      }

      return this.saveWithModeration(trxProvider, { ...poll, status: PollStatus.MODERATION }, acs)
    })
  }

  private async saveBasePoll(
    trxProvider: TrxProvider,
    poll: RatingMonitor,
    acs: ACS,
  ): Promise<string> {
    const uid = await this.dao.saveOrUpdate(trxProvider, poll, acs)
    await this.pollService.index(uid, poll)
    return uid
  }

  private async saveWithModeration(
    trxProvider: TrxProvider,
    poll: RatingMonitor,
    acs: ACS,
  ): Promise<string> {
    const uid = await this.saveBasePoll(trxProvider, poll, acs)

    await this.personDao.updatePublicStatusByUserUID(trxProvider, poll.authorUID)
    await this.moderationDao.save(trxProvider, ModerationType.POLL, uid, poll.title)

    return uid
  }

  stopRatingMonitor(uid: string): Promise<void> {
    logger.debug('rating-monitor.service.hide-poll.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.stopMonitor(trxProvider, uid)

      // NOTE This script is responsible for changing the 'status' field
      // IMPORTANT! Need use only params for transfer parameters and their values to the script
      const script = esb
        .script('source', 'ctx._source.status = params.status')
        .params({ status: PollStatus.COMPLETED })

      await this.elasticClient.update(uid, EntityNames.poll, script.toJSON())
      logger.debug('rating-monitor.service.hide-poll.done')
    })
  }
}
