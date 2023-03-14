import { List } from 'immutable'
import { inject, injectable } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { logger } from '../../logger/LoggerFactory'
import { appendAuthorDataQuery } from '../../person/db/AuthorDataDAOUtility'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { PollDAO } from '../../polls/db/PollDAO'
import { PollDTOHelper } from '../../polls/db/PollDTOHelper'
import { PollAnswer } from '../../polls/models/PollAnswer'
import { PollAnswerStatus } from '../../polls/models/PollAnswerStatus'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollType } from '../../polls/models/PollType'
import { ACS } from '../../security/acs/models/ACS'
import { RatingMonitorDTOTuple } from '../dto/RatingMonitorDTOTuple'
import { RatingMonitor } from '../models/RatingMonitor'
import { RatingMonitorDAO } from './RatingMonitorDAO'

@injectable()
export class RatingMonitorDAOImpl implements RatingMonitorDAO {
  constructor(@inject('PollDAO') private readonly pollDAO: PollDAO) {}
  async delete(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<void> {
    return this.pollDAO.delete(trxProvider, uid, acs)
  }

  public async get(
    trxProvider: TrxProvider,
    uid: string,
    acs: ACS,
  ): Promise<ObjectWithAuthorDataObject<RatingMonitor> | undefined> {
    logger.debug('rating-monitor.dao.get.start')
    const trx = await trxProvider()

    const query = trx<RatingMonitorDTOTuple | undefined>('poll')
      .select(
        'poll.uid as uid',
        'poll.theme as theme',
        'poll.complexWorkflow as complexWorkflow',
        'poll.anonymous as anonymous',
        'poll.status as status',
        'poll.title as title',
        'poll.body as body',
        'poll.createdAt as createdAt',
        'poll.publishedAt as publishedAt',
        'poll.discussionStartAt as discussionStartAt',
        'poll.votingStartAt as votingStartAt',
        'poll.tags as tags',
        'poll.competencyTags as competencyTags',
        'poll.taAddressRegion as taAddressRegion',
        'poll.taAddressDistrict as taAddressDistrict',
        'poll.taAddressTown as taAddressTown',
        'poll.taSocialStatuses as taSocialStatuses',
        'poll.taAgeGroups as taAgeGroups',
        'poll.taGenders as taGenders',
        'poll.authorUID as authorUID',
        'poll.answersCount as answersCount',
        'poll.votesCount as votesCount',
        'poll.commentsCount as commentsCount',
        'poll.isHidden as isHidden',
        'poll.pollType as pollType',
        'poll.image as image',
        'poll_answer.uid as answerUid',
        'poll_answer.basic as answerBasic',
        'poll_answer.status as answerStatus',
        'poll_answer.index as answerIndex',
        'poll_answer.title as answerTitle',
        'poll_answer.createdAt as answerCreatedAt',
        'poll_answer.authorUID as answerAuthorUID',
      )
      .leftJoin('poll_answer', 'poll.uid', 'poll_answer.pollUID')
      .where('poll.uid', uid)
      .where(acs.toSQL())
    appendAuthorDataQuery(query, 'poll')

    const pollTuples = await query

    if (!pollTuples || pollTuples.length === 0) {
      return undefined
    }

    const singleObjectArray = PollDTOHelper.constructPollArrayFromTuplesArray(pollTuples)
    if (singleObjectArray.length !== 1) {
      throw new ServerError('Cannot create single Poll from loaded data')
    }

    logger.debug('rating-monitor.dao.get.done')
    return singleObjectArray[0]
  }

  async list(
    /* eslint-disable @typescript-eslint/no-unused-vars */
    trxProvider: TrxProvider,
    filter: EntityFilter,
    acs: ACS,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  ): Promise<PagedList<RatingMonitor>> {
    return {
      metadata: {
        total: 0,
        limit: 0,
        offset: 0,
      },
      list: List([]),
    }
  }

  public saveOrUpdate(trxProvider: TrxProvider, entity: RatingMonitor, acs: ACS): Promise<string> {
    logger.debug('rating-monitor.dao.save-or-update')
    if (entity.uid) {
      return this.update(trxProvider, entity, acs).then(() => entity.uid as string)
    } else {
      return this.create(trxProvider, entity)
    }
  }

  private async create(trxProvider: TrxProvider, poll: RatingMonitor): Promise<string> {
    logger.debug('rating-monitor.dao.create.start')
    const trx = await trxProvider()
    const uid = uuidv4()
    // rating monitor should be always in the 'DISCUSSION' status after moderation approve
    await trx('poll').insert({
      uid: uid,
      theme: poll.theme,
      complexWorkflow: poll.complexWorkflow,
      anonymous: poll.anonymous,
      status: poll.status,
      title: poll.title,
      body: poll.body,
      createdAt: DateUtility.now(),
      discussionStartAt: poll.discussionStartAt,
      votingStartAt: DateUtility.now(),
      votingEndAt: null,
      tags: JSON.stringify(poll.tags.toArray()),
      competencyTags: JSON.stringify(poll.competencyTags.toArray()),
      taAgeGroups: JSON.stringify(poll.taAgeGroups.toArray()),
      taGenders: JSON.stringify(poll.taGenders.toArray()),
      taSocialStatuses: JSON.stringify(poll.taSocialStatuses.toArray()),
      taAddressRegion: poll.taAddressRegion,
      taAddressDistrict: poll.taAddressDistrict,
      authorUID: poll.authorUID,
      taAddressTown: poll.taAddressTown,
      answersCount: poll.answers.size,
      pollType: PollType.RATING_MONITOR,
      image: poll.image,
    })

    await this.createPollAnswer(trxProvider, poll.answers, uid, poll.authorUID)
    logger.debug('rating-monitor.dao.create.done')
    return uid
  }

  private async createPollAnswer(
    trxProvider: TrxProvider,
    answers: List<PollAnswer>,
    pollUID: string,
    authorUID: string,
  ): Promise<void> {
    const trx = await trxProvider()
    const createdAt = DateUtility.now()

    logger.debug('rating-monitor.dao.create.poll-answer.start')
    const insertData: List<PollAnswer> = answers.map(el => ({
      uid: uuidv4(),
      basic: el.basic,
      status: PollAnswerStatus.PUBLISHED,
      title: el.title,
      index: el.index,
      createdAt,
      authorUID,
      pollUID,
    }))

    await trx('poll_answer').insert(insertData.toArray())
    logger.debug('rating-monitor.dao.create.poll-answer.done')
  }

  private async update(trxProvider: TrxProvider, poll: RatingMonitor, acs: ACS): Promise<void> {
    logger.debug('rating-monitor.dao.update.start')
    const trx = await trxProvider()
    // rating monitor should be always in the 'DISCUSSION' status except moderation and draft
    const result = await trx('poll')
      .update({
        theme: poll.theme,
        complexWorkflow: poll.complexWorkflow,
        anonymous: poll.anonymous,
        status: poll.status,
        title: poll.title,
        body: poll.body,
        discussionStartAt: poll.discussionStartAt,
        votingStartAt: poll.votingStartAt,
        votingEndAt: null,
        tags: JSON.stringify(poll.tags.toArray()),
        competencyTags: JSON.stringify(poll.competencyTags.toArray()),
        taAgeGroups: JSON.stringify(poll.taAgeGroups.toArray()),
        taGenders: JSON.stringify(poll.taGenders.toArray()),
        taSocialStatuses: JSON.stringify(poll.taSocialStatuses.toArray()),
        taAddressRegion: poll.taAddressRegion,
        taAddressDistrict: poll.taAddressDistrict,
        taAddressTown: poll.taAddressTown,
        answersCount: poll.answers.size,
        votesCount: 0,
        pollType: PollType.RATING_MONITOR,
        image: poll.image,
      })
      .where({ uid: poll.uid })
      .where(acs.toSQL())

    checkDAOResult(result, 'poll', 'update')

    await this.updatePollAnswersList(trxProvider, poll.answers, poll.uid || '', poll.authorUID)

    logger.debug('poll.dao.update.done')
  }

  private async updatePollAnswersList(
    trxProvider: TrxProvider,
    answers: List<PollAnswer>,
    pollUID: string,
    authorUID: string,
  ): Promise<void> {
    logger.debug('rating-monitors.dao.update.poll-answer-list.start')

    const update: List<PollAnswer> = answers.filter(singleBody => !!singleBody.uid)
    const create: List<PollAnswer> = answers.filter(singleBody => !singleBody.uid)

    await this.deletePollAnswers(
      trxProvider,
      pollUID,
      update.map(body => body.uid as string),
    )

    for (const answer of update) {
      await this.pollDAO.updateSingleAnswer(trxProvider, answer)
    }

    if (create.size) {
      await this.createPollAnswer(trxProvider, create, pollUID, authorUID)
    }

    logger.debug('poll.dao.update.poll-answer-list.done')
  }

  private async deletePollAnswers(
    trxProvider: TrxProvider,
    pollUID: string,
    except?: List<string>,
  ): Promise<void> {
    logger.debug('rating-monitor.dao.delete.poll-answer.start')
    const trx = await trxProvider()
    const queryBuilder = trx('poll_answer').where({ pollUID })

    if (except && except.size) {
      queryBuilder.whereNotIn('uid', except.toArray())
    }

    await queryBuilder.delete()

    logger.debug('rating-monitor.dao.delete.poll-answer.done')
  }

  async stopMonitor(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('rating-monitor.dao.hide.start')
    const trx = await trxProvider()
    const poll = await trx<RatingMonitor | undefined>('poll')
      .where({ uid })
      .first()
    if (!poll || poll.pollType !== PollType.RATING_MONITOR) {
      throw new ServerError(
        'Not found',
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'rating-monitor',
      )
    }
    const result = await trx('poll')
      .update({
        status: PollStatus.COMPLETED,
      })
      .where({ uid })
    checkDAOResult(result, 'poll', 'hide')
    logger.debug('rating-monitor.dao.hide.done')
  }
}
