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
import { PagedList } from '../../generic/model/PagedList'
import { GenericServiceImpl } from '../../generic/service/GenericServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { ModerationDAO } from '../../moderation/db/ModerationDAO'
import { ModerationType } from '../../moderation/model/ModerationType'
import { PersonDAO } from '../../person/db/PersonDAO'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { RatingMonitor } from '../../ratingMonitor/models/RatingMonitor'
import { ACS } from '../../security/acs/models/ACS'
import { PollDAO } from '../db/PollDAO'
import { NotificationPollData } from '../models/NotificationPollData'
import { Poll } from '../models/Poll'
import { PollAnswer } from '../models/PollAnswer'
import { PollIndex } from '../models/PollIndex'
import { ElasticParams, PollListFilter } from '../models/PollQueryList'
import { PollStatus } from '../models/PollStatus'
import { PollService } from './PollService'

@injectable()
export class PollServiceImpl extends GenericServiceImpl<Poll, PollDAO> implements PollService {
  constructor(
    @inject('PollDAO') dao: PollDAO,
    @inject('DBConnection') db: Knex,
    @inject('Elastic') private elasticClient: Elastic,
    @inject('ModerationDAO') private moderationDao: ModerationDAO,
    @inject('PersonDAO') private personDao: PersonDAO,
  ) {
    super(dao, db)
  }

  private getUniqAnswerAuthorUIDs(poll: Poll): Array<string> {
    return poll.answers
      .toSet()
      .map(answer => answer.authorUID)
      .delete(poll.authorUID)
      .toArray()
  }

  private async getAnswersAuthorData(trxProvider: TrxProvider, poll: Poll): Promise<Poll> {
    logger.debug('poll.service.get-with-author-date-on-answers.start')
    const authorUIDs = this.getUniqAnswerAuthorUIDs(poll)

    if (authorUIDs.length > 0) {
      const authorData = await this.personDao.getAuthorsByUserUIDs(trxProvider, authorUIDs)
      const answers = poll.answers.map(answer => {
        return { ...answer, authorData: authorData.find(el => el.uid === answer.authorUID) }
      })
      logger.debug('poll.service.get-with-author-date-on-answers.done')
      return { ...poll, answers }
    }
    logger.debug('poll.service.get-with-author-date-on-answers.done')
    return poll
  }

  public async get(uid: string, acs: ACS): Promise<ObjectWithAuthorDataObject<Poll> | undefined> {
    logger.debug('poll.service.get.start')
    return TrxUtility.transactional<ObjectWithAuthorDataObject<Poll> | undefined>(
      this.db,
      async trxProvider => {
        const poll = await this.dao.get(trxProvider, uid, acs)

        if (poll) {
          logger.debug('poll.service.get.done')
          return this.getAnswersAuthorData(trxProvider, poll)
        }

        logger.debug('poll.service.get.undefined.done')
        return poll
      },
    )
  }

  public async savePollAnswer(answer: PollAnswer, acs: ACS): Promise<string> {
    return TrxUtility.transactional<string>(this.db, async trxProvider => {
      logger.debug('poll.service.add-answer.start')
      const existingPoll = await this.dao.get(trxProvider, answer.pollUID, acs)

      if (existingPoll && existingPoll.status !== PollStatus.DISCUSSION) {
        logger.debug('poll.service.add-answer.error.forbidden-add-answer')
        throw new ServerError(
          'Forbidden',
          403,
          ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
          'add-poll-answer',
        )
      }

      const uid = await this.dao.addSingleAnswer(trxProvider, answer, acs)

      await this.moderationDao.save(trxProvider, ModerationType.POLL_ANSWER, uid, answer.title)

      logger.debug('poll.service.add-answer.start')
      return uid
    })
  }

  public async list(params: PollListFilter, acs: ACS): Promise<PagedList<Poll>> {
    logger.debug('poll.service.list')
    const UIDs = params.elastic && (await this.findInElastic(params.elastic))

    return TrxUtility.transactional<PagedList<Poll>>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider, params, acs, UIDs)
      return list
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async save(_poll: Poll, _acs: ACS): Promise<string> {
    logger.debug('poll.service.save')
    throw new ServerError('Method not supported', 500)
  }

  private async saveBasePoll(trxProvider: TrxProvider, poll: Poll, acs: ACS): Promise<string> {
    const uid = await this.dao.saveOrUpdate(trxProvider, poll, acs)
    await this.index(uid, poll)

    return uid
  }

  private async saveWithModeration(
    trxProvider: TrxProvider,
    poll: Poll,
    acs: ACS,
  ): Promise<string> {
    const uid = await this.saveBasePoll(trxProvider, poll, acs)

    await this.personDao.updatePublicStatusByUserUID(trxProvider, poll.authorUID)
    await this.moderationDao.save(trxProvider, ModerationType.POLL, uid, poll.title)

    return uid
  }

  public async savePoll(poll: Poll, saveAsDraft: boolean, acs: ACS): Promise<string> {
    logger.debug('poll.service.save-poll.start')
    return await TrxUtility.transactional<string>(this.db, async trxProvider => {
      if (poll.uid) {
        logger.debug('poll.service.save-poll.update.start')
        const existingPoll = await this.dao.get(trxProvider, poll.uid, acs)

        if (!existingPoll) {
          logger.debug('poll.service.save-poll.update.error.poll-does-not-exist')
          throw new ServerError(
            'Poll cannot be found',
            404,
            NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
            'update-poll',
          )
        }

        if (!PollUtility.verifyAllowedPollStatusForSave(existingPoll)) {
          logger.debug('poll.service.save-poll.update.error.forbidden-change-status')
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

  public async index(uid: string, poll: Poll | RatingMonitor): Promise<void> {
    const indexBody: PollIndex = PollUtility.toPollIndex(poll)
    await this.elasticClient.index(uid, EntityNames.poll, indexBody)
  }

  public async getPollByStatuses(
    pollStatuses: Array<PollStatus>,
  ): Promise<Array<Record<string, string>>> {
    logger.debug('poll.service.get-active-polls.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      const list = await this.dao.getPollByStatuses(trxProvider, pollStatuses)
      logger.debug('poll.service.get-active-polls.done')
      return list
    })
  }

  public async getUserPollCount(userUID: string): Promise<number> {
    logger.debug('poll.service.get-user-poll-count.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      const pollCounter = await this.dao.getUserPollCount(trxProvider, userUID)
      logger.debug('poll.service.get-user-poll-count.done')
      return pollCounter
    })
  }

  private async findInElastic(elastic: ElasticParams): Promise<Array<string>> {
    const builder = esb.boolQuery()
    if (elastic.theme) {
      builder.must(esb.termQuery('theme', elastic.theme.toLowerCase()))
    }
    if (elastic.taAddressRegion) {
      builder.must(esb.termQuery('taAddressRegion', elastic.taAddressRegion.toLowerCase()))
    }
    if (elastic.tags) {
      const tagsQuery = elastic.tags.map(tag => esb.termQuery('tags', tag.toLowerCase()))
      builder.must(esb.boolQuery().should(tagsQuery))
    }

    if (elastic.exclTags) {
      const exclTagsQuery = elastic.exclTags.map(exclTags =>
        esb.termQuery('tags', exclTags.toLowerCase()),
      )
      builder.mustNot(esb.boolQuery().should(exclTagsQuery))
    }

    if (elastic.competencyTags) {
      const competencyTagsQuery = elastic.competencyTags.map(tag =>
        esb.termQuery('competencyTags', tag.toLowerCase()),
      )
      builder.must(esb.boolQuery().should(competencyTagsQuery))
    }

    if (elastic.status) {
      const statusQuery = elastic.status.map(status =>
        esb.termQuery('status', status.toLowerCase()),
      )
      builder.must(esb.boolQuery().should(statusQuery))
    }

    if (elastic.pollType) {
      builder.must(esb.termQuery('pollType', elastic.pollType.toLowerCase()))
    }

    if (elastic.publishedAtStart) {
      builder.must(esb.rangeQuery('publishedAt').gte(elastic.publishedAtStart.toISOString()))
    }

    if (elastic.publishedAtEnd) {
      builder.must(esb.rangeQuery('publishedAt').lte(elastic.publishedAtEnd.toISOString()))
    }

    if (elastic.authorUID) {
      builder.must(esb.termQuery('authorUID', elastic.authorUID.split('-', 5).join('')))
    }

    if (elastic.searchTerm) {
      const fields = ['body^3', 'title^5']

      if (!elastic.tags) {
        fields.push('tags^1')
      }

      builder.must(esb.multiMatchQuery(fields, elastic.searchTerm))
    }

    const data = await this.elasticClient.search<PollIndex>('poll', builder.toJSON())
    return data.hits.map(el => el._id)
  }

  public async getPollAnswerInfo(
    pollUID: string,
    userUID: string,
  ): Promise<PollAnswer | undefined> {
    logger.debug('poll.service.get-poll-answer-info.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      const answerInfo = await this.dao.findAnswerForUser(trxProvider, pollUID, userUID)

      logger.debug('poll.service.get-poll-answer-info.done')
      return answerInfo
    })
  }

  public async partialUpdate(uid: string, poll: Partial<Poll>, acs: ACS): Promise<void> {
    logger.debug('poll.service.partial-update.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.partialUpdate(trxProvider, uid, poll, acs)
      logger.debug('poll.service.partial-update.done')
    })
  }

  public async hidePoll(uid: string): Promise<void> {
    logger.debug('poll.service.hide-poll.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.hidePoll(trxProvider, uid)
      logger.debug('poll.service.hide-poll.done')
    })
  }

  public async getPollsForNotification(UIDs: Array<string>): Promise<Array<NotificationPollData>> {
    logger.debug('poll.service.get-polls-for-notification.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      const pollsData = await this.dao.getPollsForNotification(trxProvider, UIDs)
      logger.debug('poll.service.get-polls-for-notification.done')
      return pollsData
    })
  }
}
