import { List } from 'immutable'
import { inject, injectable } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import { Comment } from '../../comment/model/Comment'
import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAO } from '../../polls/db/PollDAO'
import { PollAnswer } from '../../polls/models/PollAnswer'
import { GrandAccessACS } from '../../security/acs/strategies'
import { TelegramBotService } from '../../telegram-bot/TelegramBotService'
import { Moderation, ReferenceObjectType, ReferenceObjectWithAuthor } from '../model/Moderation'
import { ModerationResolutionType } from '../model/ModerationResolutionType'
import { ModerationResolve } from '../model/ModerationResolve'
import { ModerationType } from '../model/ModerationType'
import { ModerationDAO } from './ModerationDAO'

@injectable()
export class ModerationDAOImpl implements ModerationDAO {
  constructor(
    @inject('PollDAO') private pollDAO: PollDAO,
    @inject('TelegramBotService') private telegramBot: TelegramBotService,
  ) {}

  public async save(
    trxProvider: TrxProvider,
    type: ModerationType,
    reference: string,
    summary: string,
  ): Promise<void> {
    logger.debug('moderation.dao.save.start')

    const trx = await trxProvider()
    const moderationCase = await trx<Moderation>('moderation_case')
      .where({ type, reference, resolution: ModerationResolutionType.PENDING })
      .first()

    if (!moderationCase) {
      return this.create(trxProvider, type, reference, summary)
    }

    const { lockingCounter } = moderationCase

    await trx<Moderation>('moderation_case')
      .update({
        summary: summary,
        lockingCounter: lockingCounter + 1,
      })
      .where({ uid: moderationCase?.uid, lockingCounter })

    logger.debug('moderation.dao.save.done')
  }

  public async resolveOrReject(
    trxProvider: TrxProvider,
    moderation: ModerationResolve,
  ): Promise<void> {
    logger.debug('moderation.dao.resolveOrReject.start')

    const trx = await trxProvider()

    const result = await trx('moderation_case')
      .where({
        uid: moderation.uid,
        lockingCounter: moderation.lockingCounter,
        resolution: ModerationResolutionType.PENDING,
      })
      .update({
        resolution: moderation.resolution,
        concern: moderation.concern,
        resolvedAt: DateUtility.now(),
        moderatorUID: moderation.moderatorUID,
      })

    checkDAOResult(result, 'moderation', 'resolve-or-reject')
    logger.debug('moderation.dao.resolve-or-reject.done')
  }

  private async getReferencedObject(
    trxProvider: TrxProvider,
    uid: string,
    from: ModerationType,
  ): Promise<ReferenceObjectWithAuthor> {
    logger.debug('moderation.dao.get-referenced-object.start')

    if (from === ModerationType.POLL) {
      const poll = await this.pollDAO.get(trxProvider, uid, new GrandAccessACS())
      logger.debug('moderation.dao.get-referenced-poll.done')
      return { object: poll }
    }

    const trx = await trxProvider()

    if (from === ModerationType.USER) {
      const person = await trx('person')
        .select('person.*')
        .innerJoin('users', 'person.uid', 'users.personUID')
        .where('users.uid', uid)
        .first()
      return { object: person }
    }

    const query = trx<ReferenceObjectType>(from).first()

    const entity: PollAnswer | Comment = await query.where({ uid })
    // FIXME: Load after data with comment, poll_answer
    const authorData = await PersonDAOImpl.getAuthorData(trxProvider, entity.authorUID as string)
    logger.debug('moderation.dao.get-referenced-object.done')
    return {
      object: entity,
      authorData,
    }
  }

  public async get(trxProvider: TrxProvider, uid: string): Promise<Moderation | undefined> {
    logger.debug('moderation.dao.get.start')
    const trx = await trxProvider()

    const result = await trx<Moderation>('moderation_case')
      .where('uid', uid)
      .first()

    if (!result) {
      return result
    }

    const referencedObject = await this.getReferencedObject(
      trxProvider,
      result.reference,
      result.type,
    )

    logger.debug('moderation.dao.get.done')
    // TODO: authorData should be moved to referencedObject
    return {
      referencedObject: referencedObject.object,
      authorData: referencedObject.authorData,
      ...result,
    }
  }

  public async list(
    trxProvider: TrxProvider,
    filter: EntityFilter,
  ): Promise<PagedList<Moderation>> {
    logger.debug('moderation.dao.list.start')
    const trx = await trxProvider()

    const mainQuery = trx<Moderation>('moderation_case')

    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      mainQuery,
      filter,
    )
    logger.debug('moderation.dao.list.counted')

    const cases = await PaginationUtility.applyPaginationForQuery(mainQuery, filter).select('*')

    logger.debug('moderation.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(cases),
    }
  }

  public async getModerationResult(
    trxProvider: TrxProvider,
    entityUID: string,
    moderationType: ModerationType,
  ): Promise<Moderation | undefined> {
    logger.debug('moderation.dao.get-info-of-rejected-poll.start')
    const trx = await trxProvider()
    const result = await trx<Moderation>('moderation_case')
      .where('type', moderationType)
      .where('reference', entityUID)
      .whereNot('resolution', ModerationResolutionType.PENDING)
      .orderBy('resolvedAt', 'desc')
      .first()

    logger.debug('moderation.dao.get-info-of-rejected-poll.done')
    return result
  }

  private async create(
    trxProvider: TrxProvider,
    type: ModerationType,
    reference: string,
    summary: string,
  ): Promise<void> {
    logger.debug('moderation.dao.create.start')
    const uid = uuidv4()

    const trx = await trxProvider()
    await trx('moderation_case').insert({
      uid,
      type: type,
      reference: reference,
      summary: summary,
      createdAt: DateUtility.now(),
    })

    // TODO Move it to separate notification service block
    // FIXME remove this
    if (type !== ModerationType.USER) {
      await this.telegramBot.notifyModerators()
    }

    logger.debug('moderation.dao.create.done')
  }
}
