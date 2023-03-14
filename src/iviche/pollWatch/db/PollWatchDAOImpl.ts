import { List } from 'immutable'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { ACS } from '../../security/acs/models/ACS'
import { PollWatchDTOTuple } from '../dto/PollWatchDTOTuple'
import PollWatch from '../models/PollWatch'
import { PollWatchDAO } from './PollWatchDAO'

export class PollWatchDAOImpl implements PollWatchDAO {
  public saveOrUpdate(trxProvider: TrxProvider, entity: PollWatch, acs: ACS): Promise<string> {
    logger.debug('pollWatch.dao.save-or-update')
    if (entity.uid) {
      return this.update(trxProvider, entity, acs).then(() => entity.uid as string)
    } else {
      return this.create(trxProvider, entity)
    }
  }

  public async partialUpdate(
    trxProvider: TrxProvider,
    uid: string,
    pollWatch: Partial<PollWatch>,
  ): Promise<void> {
    logger.debug('pollWatch.dao.partial-update.start')

    const trx = await trxProvider()

    const result = await trx('poll_watch')
      .where({ uid })
      .update(pollWatch)

    checkDAOResult(result, 'poll_watch', 'partial-update')
    logger.debug('poll_watch.dao.partial-update.done')
  }

  private async create(trxProvider: TrxProvider, pollWatch: PollWatch): Promise<string> {
    logger.debug('pollWatch.dao.create.start')
    const trx = await trxProvider()
    const uid = uuidv4()

    await trx<PollWatch>('poll_watch').insert({
      uid,
      pollUID: pollWatch.pollUID,
      pollTitle: pollWatch.pollTitle,
      contactType: pollWatch.contactType,
      userUID: pollWatch.userUID,
      createdAt: DateUtility.now(),
    })
    logger.debug('pollWatch.dao.create.done')
    return uid
  }

  private async update(trxProvider: TrxProvider, pollWatch: PollWatch, acs: ACS): Promise<void> {
    logger.debug('pollWatch.dao.update.start')
    const trx = await trxProvider()

    const result = await trx<PollWatch>('poll_watch')
      .update({
        pollUID: pollWatch.pollUID,
        pollTitle: pollWatch.pollTitle,
        contactType: pollWatch.contactType,
        userUID: pollWatch.userUID,
        createdAt: DateUtility.now(),
      })
      .where({ uid: pollWatch.uid })
      .where(acs.toSQL())

    checkDAOResult(result, 'pollWatch', 'update')

    logger.debug('pollWatch.dao.update.done')
  }

  public async get(
    trxProvider: TrxProvider,
    uid: string,
    acs: ACS,
  ): Promise<PollWatch | undefined> {
    logger.debug('pollWatch.dao.get.start')
    const trx = await trxProvider()

    const query = await trx('poll_watch')
      .where('poll_watch.uid', uid)
      .where(acs.toSQL())
    logger.debug('pollWatch.dao.get.done')
    return query[0]
  }

  public async delete(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('pollWatch.dao.delete.start')
    const trx = await trxProvider()
    const result = await trx<PollWatch>('poll_watch')
      .where({ uid: uid })
      .delete()

    checkDAOResult(result, 'pollWatch', 'delete')
    logger.debug('pollWatch.dao.delete.done')
  }

  public async list(
    trxProvider: TrxProvider,
    params: EntityFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<PollWatch>> {
    logger.debug('pollWatch.dao.list.start')
    const trx = await trxProvider()

    const tuples = trx<PollWatchDTOTuple | undefined>('poll_watch').where(
      acs.toSQL('poll_watch.userUID'),
    )

    if (UIDs) {
      tuples.whereIn('poll_watch.uid', UIDs)
    }

    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      tuples,
      params,
    )
    logger.debug('pollWatch.dao.list.counted')
    const whereIn = PaginationUtility.applyPaginationForQuery(tuples.clone().select('uid'), {
      limit: params.limit,
      offset: params.offset,
    })

    tuples
      .select(
        'poll_watch.uid as uid',
        'poll_watch.pollUID as pollUID',
        'poll.title as pollTitle',
        'poll_watch.userUID as userUID',
        'poll_watch.contactType as contactType',
        'poll_watch.createdAt as createdAt',
      )
      .leftJoin('poll', 'poll_watch.pollUID', 'poll.uid')
      .whereIn('poll_watch.uid', whereIn)

    const pollWatchTuplesRes = await tuples

    logger.debug('poll.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(pollWatchTuplesRes),
    }
  }
}
