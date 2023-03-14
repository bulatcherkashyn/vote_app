import { injectable } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { logger } from '../../logger/LoggerFactory'
import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { Comment } from '../model/Comment'
import { CommentEntity } from '../model/CommentEntity'
import { CommentDAO } from './CommentDAO'

@injectable()
export class CommentDAOImpl implements CommentDAO {
  private EDIT_TIME_LIMIT = '1 hour'
  public async saveOrUpdate(trxProvider: TrxProvider, entity: Comment, acs: ACS): Promise<string> {
    logger.debug('comment.dao.save-or-update')
    if (entity.uid) {
      return this.update(trxProvider, entity, acs)
    } else {
      return this.create(trxProvider, entity)
    }
  }

  public async get(trxProvider: TrxProvider, uid: string): Promise<Comment | undefined> {
    logger.debug('comment.dao.get.start')
    const trx = await trxProvider()

    const comment = await trx<Comment | undefined>('comment')
      .select(
        'comment.uid as uid',
        'comment.entityType as entityType',
        'comment.entityUID as entityUID',
        'comment.threadUID as threadUID',
        'comment.parentUID as parentUID',
        'comment.text as text',
        'comment.likesCounter as likesCounter',
        'comment.dislikesCounter as dislikesCounter',
        'comment.ratedBy as ratedBy',
        'comment.reports as reports',
        'comment.createdAt as createdAt',
        'comment.authorUID as authorUID',
      )
      .where({ uid })
      .first()

    logger.debug('comment.dao.get.done')
    return comment
  }

  public async getCommentThreads(
    trxProvider: TrxProvider,
    entityType: string,
    entityUID: string,
    userUID: string,
  ): Promise<Array<ObjectWithAuthorFields<Comment>>> {
    logger.debug('comment.dao.get-comment-thread.start')

    const trx = await trxProvider()
    const thread = await trx<Comment>('comment')
      .select(
        'comment.uid as uid',
        'comment.entityType as entityType',
        'comment.entityUID as entityUID',
        'comment.threadUID as threadUID',
        'comment.parentUID as parentUID',
        'comment.text as text',
        'comment.likesCounter as likesCounter',
        'comment.dislikesCounter as dislikesCounter',
        'comment.createdAt as createdAt',
        'comment.authorUID as authorUID',
        userUID ? trx.raw(`"ratedBy"->'${userUID}' as "isRated"`) : '',
        'person.isLegalPerson as isLegalPerson',
        'person.firstName as firstName',
        'person.lastName as lastName',
        'person.shortName as shortName',
        'person.avatar as avatar',
      )
      .where({ entityType, entityUID })
      .innerJoin('users', 'comment.authorUID', 'users.uid')
      .innerJoin('person', 'users.personUID', 'person.uid')
      .orderBy('comment.createdAt', 'asc')

    logger.debug('comment.dao.get-comment-thread.done')
    return thread
  }

  public async delete(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<void> {
    logger.debug('comment.dao.delete.start')
    const trx = await trxProvider()

    const queryBuilder = trx('comment')
      .where({ uid })
      .delete()

    if (!acs.fullAccess) {
      queryBuilder
        .andWhere(trx.raw(`NOW() <= ("createdAt" + '${this.EDIT_TIME_LIMIT} '::interval)`))
        .andWhere(acs.toSQL('authorUID'))
    }

    const result = await queryBuilder
    checkDAOResult(result, 'comment', 'delete')
    logger.debug('comment.dao.delete.done')
  }

  private async create(trxProvider: TrxProvider, comment: Comment): Promise<string> {
    logger.debug('comment.dao.create.start')
    const uid = uuidv4()

    const trx = await trxProvider()
    await trx('comment').insert({
      uid: uid,
      entityType: comment.entityType,
      entityUID: comment.entityUID,
      threadUID: comment.threadUID || uid,
      parentUID: comment.parentUID,
      text: comment.text,
      createdAt: DateUtility.now(),
      authorUID: comment.authorUID,
    })

    logger.debug('comment.dao.create.done')
    return uid
  }

  private async update(trxProvider: TrxProvider, comment: Comment, acs: ACS): Promise<string> {
    logger.debug('comment.dao.update.start')
    const trx = await trxProvider()
    const queryBuilder = trx('comment')
      .update({
        text: comment.text,
      })
      .where({ uid: comment.uid })

    if (!acs.fullAccess) {
      queryBuilder
        .andWhere(trx.raw(`NOW() <= ("createdAt" + '${this.EDIT_TIME_LIMIT}'::interval)`))
        .andWhere(acs.toSQL('authorUID'))
    }

    const result = await queryBuilder
    checkDAOResult(result, 'comment', 'update')
    logger.debug('comment.dao.update.done')
    return comment.uid as string
  }

  public async countComments(
    trxProvider: TrxProvider,
    entityUID: string,
    entityType: CommentEntity,
  ): Promise<number> {
    logger.debug('comment.dao.comments.count.start')
    const trx = await trxProvider()
    const count = await trx('comment')
      .count('*')
      .where({ entityUID: entityUID, entityType: entityType })

    logger.debug('comment.dao.comments.count.done')
    return count[0].count as number
  }
}
