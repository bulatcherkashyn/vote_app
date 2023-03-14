import { List } from 'immutable'
import { inject, injectable } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import { Comment } from '../../comment/model/Comment'
import { UserRole } from '../../common/UserRole'
import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { NewsDAO } from '../../news/db/NewsDAO'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAO } from '../../polls/db/PollDAO'
import { PollAnswer } from '../../polls/models/PollAnswer'
import { GrandAccessACS } from '../../security/acs/strategies'
import { Issue, IssueReferenceObjectType, IssueReferenceObjectWithAuthor } from '../model/Issue'
import { IssueListFilter } from '../model/IssueQueryList'
import { IssueReferenceType } from '../model/IssueReferenceType'
import { IssueResolution } from '../model/IssueResolution'
import { IssueResolve } from '../model/IssueResolve'
import { IssueDAO } from './IssueDAO'

@injectable()
export class IssueDAOImpl implements IssueDAO {
  constructor(
    @inject('PollDAO') private pollDAO: PollDAO,
    @inject('NewsDAO') private newsDAO: NewsDAO,
  ) {}

  private async getReferencedObject(
    trxProvider: TrxProvider,
    uid: string,
    from: IssueReferenceType,
  ): Promise<IssueReferenceObjectWithAuthor> {
    logger.debug('issue.dao.get-referenced-object.start')

    if (from === IssueReferenceType.POLL) {
      const poll = await this.pollDAO.get(trxProvider, uid, new GrandAccessACS())

      logger.debug('issue.dao.get-referenced-poll.done')
      return { object: poll, authorData: poll?.authorData }
    }

    if (from === IssueReferenceType.NEWS) {
      const news = await this.newsDAO.getBy(trxProvider, 'uid', uid)
      logger.debug('issue.dao.get-referenced-news.done')
      return { object: news, authorData: news?.authorData }
    }

    const trx = await trxProvider()

    if (from === IssueReferenceType.USER) {
      const person = await trx('person')
        .select('person.*')
        .innerJoin('users', 'person.uid', 'users.personUID')
        .where('users.uid', uid)
        .first()
      return { object: person }
    }

    const query = trx<IssueReferenceObjectType>(from).first()

    const entity: PollAnswer | Comment = await query.where({ uid })
    // FIXME: Load after data with comment, poll_answer
    const authorData = await PersonDAOImpl.getAuthorData(trxProvider, entity.authorUID as string)

    logger.debug('issue.dao.get-referenced-object.done')
    return {
      object: entity,
      authorData,
    }
  }

  public async save(trxProvider: TrxProvider, issue: Issue): Promise<void> {
    logger.debug('issue.dao.save.start')
    const uid = uuidv4()

    const trx = await trxProvider()
    await trx('issue').insert({
      uid,
      type: issue.type,
      body: issue.body,
      userUID: issue.userUID === UserRole.ANONYMOUS ? undefined : issue.userUID,
      issuerEmail: issue.issuerEmail,
      reference: issue.reference,
      referenceObjectType: issue.referenceObjectType,
      resolution: issue.resolution,
      createdAt: DateUtility.now(),
    })
    logger.debug('issue.dao.save.done')
  }

  public async get(trxProvider: TrxProvider, uid: string): Promise<Issue | undefined> {
    logger.debug('issue.dao.get.start')
    const trx = await trxProvider()

    let referencedObject
    let authorData
    const result = await trx<Issue>('issue')
      .where('uid', uid)
      .first()

    if (!result) {
      return result
    }

    if (result.reference && result.referenceObjectType) {
      referencedObject = await this.getReferencedObject(
        trxProvider,
        result.reference,
        result.referenceObjectType,
      )
    }

    if (result.userUID) {
      authorData = await PersonDAOImpl.getAuthorData(trxProvider, result.userUID as string)
    }

    logger.debug('issue.dao.get.done')
    return {
      ...result,
      referencedObject: { ...referencedObject?.object, authorData: referencedObject?.authorData },
      authorData,
    }
  }

  public async list(trxProvider: TrxProvider, filter: IssueListFilter): Promise<PagedList<Issue>> {
    logger.debug('issue.dao.list.start')
    const trx = await trxProvider()

    const mainQuery = trx<Issue>('issue')

    filter.type && mainQuery.whereIn('type', filter.type)
    filter.resolution && mainQuery.whereIn('resolution', filter.resolution)

    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      mainQuery,
      filter,
    )

    logger.debug('issue.dao.list.counted')
    const issues = await PaginationUtility.applyPaginationForQuery(mainQuery, filter)
      .select('*')
      .orderBy('createdAt', 'desc')

    logger.debug('issue.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(issues),
    }
  }

  public async changeResolution(trxProvider: TrxProvider, issue: IssueResolve): Promise<void> {
    logger.debug('issue.dao.change-resolution.start')

    const trx = await trxProvider()

    const result = await trx('issue')
      .where({
        uid: issue.uid,
        resolution: IssueResolution.PENDING,
      })
      .update({
        resolution: issue.resolution,
        comment: issue.comment,
        resolvedAt: DateUtility.now(),
        moderatorUID: issue.moderatorUID,
      })

    checkDAOResult(result, 'issue', 'change-resolution')
    logger.debug('issue.dao.change-resolution.done')
  }
}
