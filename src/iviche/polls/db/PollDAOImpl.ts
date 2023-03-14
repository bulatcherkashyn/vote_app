import { List } from 'immutable'
import { QueryBuilder } from 'knex'
import uuidv4 from 'uuid/v4'

import { sortByUIDQuery } from '../../common/SortByUIDQuery'
import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { ServerError } from '../../error/ServerError'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { EntityOrder } from '../../generic/model/EntitySort'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { appendAuthorDataQuery } from '../../person/db/AuthorDataDAOUtility'
import { ObjectWithAuthorDataObject, ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { PollDTOTuple } from '../dto/PollDTOTuple'
import { NotificationPollData } from '../models/NotificationPollData'
import { Poll } from '../models/Poll'
import { PollAnswer } from '../models/PollAnswer'
import { PollAnswerStatus } from '../models/PollAnswerStatus'
import { PollOrderBy } from '../models/PollOrderBy'
import { PollListFilter } from '../models/PollQueryList'
import { PollStatus } from '../models/PollStatus'
import { PollDAO } from './PollDAO'
import { applyOrderBy } from './PollDAOHelper'
import { PollDTOHelper } from './PollDTOHelper'

export class PollDAOImpl implements PollDAO {
  private orderMap: {
    [key in PollOrderBy]: (queryBuilder: QueryBuilder) => void
  }
  constructor() {
    this.orderMap = {
      [PollOrderBy.LATEST]: this.latest,
      [PollOrderBy.MOST_VOTES]: this.mostVotes,
      [PollOrderBy.MOST_COMMENTS]: this.mostComments,
      [PollOrderBy.END_SOON]: this.endSoon,
      [PollOrderBy.CREATED_AT]: this.createdAt,
    }
  }
  public saveOrUpdate(trxProvider: TrxProvider, entity: Poll, acs: ACS): Promise<string> {
    logger.debug('poll.dao.save-or-update')
    if (entity.uid) {
      return this.update(trxProvider, entity, acs).then(() => entity.uid as string)
    } else {
      return this.create(trxProvider, entity)
    }
  }

  public async partialUpdate(
    trxProvider: TrxProvider,
    uid: string,
    poll: Partial<Poll>,
  ): Promise<void> {
    logger.debug('poll.dao.partial-update.start')

    const trx = await trxProvider()

    const result = await trx('poll')
      .where({ uid })
      .update(poll)

    checkDAOResult(result, 'poll', 'partial-update')
    logger.debug('poll.dao.partial-update.done')
  }

  public async addSingleAnswer(trxProvider: TrxProvider, answer: PollAnswer): Promise<string> {
    logger.debug('poll.dao.create.add-single-answer.start')
    const trx = await trxProvider()

    const uid = uuidv4()
    await trx('poll_answer').insert({
      uid,
      basic: answer.basic,
      status: PollAnswerStatus.MODERATION,
      title: answer.title,
      index: answer.index,
      createdAt: DateUtility.now(),
      authorUID: answer.authorUID,
      pollUID: answer.pollUID,
    })

    logger.debug('poll.dao.create.add-single-answer.end')
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

    logger.debug('poll.dao.create.poll-answer.start')
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
    logger.debug('poll.dao.create.poll-answer.done')
  }

  private async create(trxProvider: TrxProvider, poll: Poll): Promise<string> {
    logger.debug('poll.dao.create.start')
    const trx = await trxProvider()
    const uid = uuidv4()

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
      votingStartAt: poll.votingStartAt,
      votingEndAt: poll.votingEndAt,
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
      pollType: poll.pollType,
      image: poll.image,
    })

    await this.createPollAnswer(trxProvider, poll.answers, uid, poll.authorUID)
    logger.debug('poll.dao.create.done')
    return uid
  }

  public async updateSingleAnswer(
    trxProvider: TrxProvider,
    pollAnswer: Partial<PollAnswer>,
  ): Promise<void> {
    logger.debug('poll.dao.update.poll-answer.start')
    const trx = await trxProvider()

    const singleBody = await trx('poll_answer')
      .where({ uid: pollAnswer.uid })
      .update(pollAnswer)

    checkDAOResult(singleBody, 'poll_answer', 'update-single-poll-answer')
    logger.debug('poll.dao.update.poll-answer.done')
  }

  private async updatePollAnswersList(
    trxProvider: TrxProvider,
    answers: List<PollAnswer>,
    pollUID: string,
    authorUID: string,
  ): Promise<void> {
    logger.debug('poll.dao.update.poll-answer-list.start')

    const update: List<PollAnswer> = answers.filter(singleBody => !!singleBody.uid)
    const create: List<PollAnswer> = answers.filter(singleBody => !singleBody.uid)

    await this.deletePollAnswers(
      trxProvider,
      pollUID,
      update.map(body => body.uid as string),
    )

    for (const answer of update) {
      await this.updateSingleAnswer(trxProvider, answer)
    }

    if (create.size) {
      await this.createPollAnswer(trxProvider, create, pollUID, authorUID)
    }

    logger.debug('poll.dao.update.poll-answer-list.done')
  }

  private async update(trxProvider: TrxProvider, poll: Poll, acs: ACS): Promise<void> {
    logger.debug('poll.dao.update.start')
    const trx = await trxProvider()

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
        votingEndAt: poll.votingEndAt,
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
        pollType: poll.pollType,
        image: poll.image,
      })
      .where({ uid: poll.uid })
      .where(acs.toSQL())

    checkDAOResult(result, 'poll', 'update')

    await this.updatePollAnswersList(trxProvider, poll.answers, poll.uid || '', poll.authorUID)

    logger.debug('poll.dao.update.done')
  }

  public async get(
    trxProvider: TrxProvider,
    uid: string,
    acs: ACS,
  ): Promise<ObjectWithAuthorDataObject<Poll> | undefined> {
    logger.debug('poll.dao.get.start')
    const trx = await trxProvider()

    const query = trx<PollDTOTuple | undefined>('poll')
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
        'poll.votingEndAt as votingEndAt',
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

    logger.debug('poll.dao.get.done')
    return singleObjectArray[0]
  }

  public async delete(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<void> {
    logger.debug('poll.dao.delete.start')
    const trx = await trxProvider()

    await this.deletePollAnswers(trxProvider, uid)

    const result = await trx('poll')
      .where({ uid: uid })
      .where(acs.toSQL())
      .delete()

    checkDAOResult(result, 'poll', 'delete')
    logger.debug('poll.dao.delete.done')
  }

  private async deletePollAnswers(
    trxProvider: TrxProvider,
    pollUID: string,
    except?: List<string>,
  ): Promise<void> {
    logger.debug('poll.dao.delete.poll-answer.start')
    const trx = await trxProvider()
    const queryBuilder = trx('poll_answer').where({ pollUID })

    if (except && except.size) {
      queryBuilder.whereNotIn('uid', except.toArray())
    }

    await queryBuilder.delete()

    logger.debug('poll.dao.delete.poll-answer.done')
  }

  public async list(
    trxProvider: TrxProvider,
    params: PollListFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<ObjectWithAuthorFields<Poll>>> {
    logger.debug('poll.dao.list.start')
    const trx = await trxProvider()
    const order: EntityOrder = params.order || { orderBy: PollOrderBy.LATEST, asc: false }

    const pollTuples = trx<PollDTOTuple | undefined>('poll').where(acs.toSQL())

    if (UIDs) {
      pollTuples.whereIn('poll.uid', UIDs)
    }

    if (params.elastic?.authorUID !== acs.toArray()[0]) {
      pollTuples.where('poll.isHidden', false)
    }

    // Special case of order by, when you have to filter polls to see only non-ended
    if (order.orderBy === PollOrderBy.END_SOON) {
      pollTuples.where('poll.votingEndAt', '>', DateUtility.now())
    }

    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      pollTuples,
      params,
    )
    logger.debug('poll.dao.list.counted')

    if (params.elastic?.searchTerm) {
      sortByUIDQuery(pollTuples, UIDs, 'poll.uid')
    } else {
      this.orderMap[order.orderBy as PollOrderBy](pollTuples)
    }

    const whereIn = PaginationUtility.applyPaginationForQuery(pollTuples.clone().select('uid'), {
      limit: params.limit,
      offset: params.offset,
    })

    pollTuples
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
        'poll.votingEndAt as votingEndAt',
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
        'poll_answer.title as answerTitle',
        'poll_answer.index as answerIndex',
        'poll_answer.createdAt as answerCreatedAt',
        'poll_answer.authorUID as answerAuthorUID',
      )
      .leftJoin('poll_answer', 'poll.uid', 'poll_answer.pollUID')
      .whereIn('poll.uid', whereIn)

    appendAuthorDataQuery(pollTuples, 'poll')
    const pollTuplesRes = await pollTuples

    logger.debug('poll.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(PollDTOHelper.constructPollArrayFromTuplesArray(pollTuplesRes)),
    }
  }

  public async getPollByStatuses(
    trxProvider: TrxProvider,
    pollStatuses: Array<PollStatus>,
  ): Promise<Array<Record<string, string>>> {
    logger.debug('poll.dao.list-of-active.start')
    const trx = await trxProvider()

    const pollUIDs = await trx<string>('poll')
      .select('uid')
      .whereIn('status', pollStatuses)

    logger.debug('poll.dao.list-of-active.done')
    return pollUIDs
  }

  private endSoon = (queryBuilder: QueryBuilder): void => {
    applyOrderBy(queryBuilder, 'poll.votingEndAt', 'asc')
  }

  private mostComments = (queryBuilder: QueryBuilder): void => {
    applyOrderBy(queryBuilder, 'poll.commentsCount', 'desc')
  }

  private mostVotes = (queryBuilder: QueryBuilder): void => {
    applyOrderBy(queryBuilder, 'poll.votesCount', 'desc')
  }

  private latest = (queryBuilder: QueryBuilder): void => {
    applyOrderBy(queryBuilder, 'poll.publishedAt', 'desc')
  }

  private createdAt = (queryBuilder: QueryBuilder): void => {
    queryBuilder.orderBy('poll.createdAt', 'desc')
  }
  public async getSinglePollAnswer(
    trxProvider: TrxProvider,
    uid: string,
  ): Promise<PollAnswer | undefined> {
    logger.debug('poll.dao.get-single-answer.start')
    const trx = await trxProvider()

    const result = await trx('poll_answer')
      .where({ uid })
      .first()

    logger.debug('poll.dao.get-single-answer.done')
    return result
  }

  public async getUserPollCount(trxProvider: TrxProvider, userUID: string): Promise<number> {
    logger.debug('poll.dao.get-user-poll-count.start')
    const trx = await trxProvider()

    const result = await trx<Poll>('poll')
      .where({ authorUID: userUID })
      .count('uid')

    logger.debug('poll.dao.get-user-poll-count.done')
    return +result[0].count
  }

  public async findAnswerForUser(
    trxProvider: TrxProvider,
    pollUID: string,
    authorUID: string,
  ): Promise<PollAnswer | undefined> {
    logger.debug('poll.dao.find-answer-for-user.start')
    const trx = await trxProvider()

    const result = await trx('poll_answer')
      .where({ pollUID, authorUID })
      .first()

    logger.debug('poll.dao.find-answer-for-user.done')
    return result
  }

  public async hidePoll(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('poll.dao.hide-poll.start')

    const trx = await trxProvider()

    const result = await trx('poll')
      .where({ uid })
      .update('isHidden', true)

    checkDAOResult(result, 'poll', 'hide-poll')
    logger.debug('poll.dao.hide-poll.done')
  }

  public async getPollsForNotification(
    trxProvider: TrxProvider,
    UIDs: Array<string>,
  ): Promise<Array<NotificationPollData>> {
    logger.debug('poll.dao.get-polls-for-notification.start')
    const trx = await trxProvider()

    const result = await trx<NotificationPollData>('poll')
      .select('uid', 'status', 'title', 'body', 'authorUID')
      .whereIn('uid', UIDs)
      .andWhere('isHidden', false)

    logger.debug('poll.dao.get-polls-for-notification.done')
    return result
  }
}
