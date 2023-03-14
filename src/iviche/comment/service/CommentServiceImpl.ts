import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { logger } from '../../logger/LoggerFactory'
import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { CommentDAO } from '../db/CommentDAO'
import { Comment } from '../model/Comment'
import { CommentEntity } from '../model/CommentEntity'
import { CommentService } from './CommentService'

@injectable()
export class CommentServiceImpl implements CommentService {
  constructor(
    @inject('CommentDAO') private dao: CommentDAO,
    @inject('DBConnection') private db: Knex,
  ) {}

  public save(comment: Comment, acs: ACS): Promise<string> {
    logger.debug('comment.service.save.start')
    return TrxUtility.transactional<string>(this.db, async trxProvider => {
      comment.threadUID = await this.getCommentThreadUID(trxProvider, comment)
      const uid = await this.dao.saveOrUpdate(trxProvider, comment, acs)
      logger.debug('comment.service.save.done')
      return uid
    })
  }

  public get(uid: string): Promise<Comment | undefined> {
    logger.debug('comment.service.get.start')
    return TrxUtility.transactional<Comment | undefined>(this.db, async trxProvider => {
      const comment = await this.dao.get(trxProvider, uid)

      logger.debug('comment.service.get.done')
      return comment
    })
  }

  public getCommentThreads(
    entityType: string,
    entityUID: string,
    userUID: string,
  ): Promise<Array<ObjectWithAuthorFields<Comment>>> {
    logger.debug('comment.service.get-comment-thread.start')
    return TrxUtility.transactional<Array<ObjectWithAuthorFields<Comment>>>(
      this.db,
      async trxProvider => {
        const thread = await this.dao.getCommentThreads(trxProvider, entityType, entityUID, userUID)
        logger.debug('comment.service.get-comment-thread.done')
        return thread
      },
    )
  }

  public delete(uid: string, acs: ACS): Promise<void> {
    logger.debug('comment.service.delete.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.delete(trxProvider, uid, acs)
      logger.debug('comment.service.delete.done')
    })
  }

  private async getCommentThreadUID(trxProvider: TrxProvider, comment: Comment): Promise<string> {
    if (!comment.parentUID) {
      return comment.uid as string
    }

    const parentComment = await this.dao.get(trxProvider, comment.parentUID)
    if (!parentComment) {
      throw new ServerError(
        'Comment with this parentUID not found',
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'parentUID',
      )
    }
    return parentComment.threadUID as string
  }

  public async countComments(entityUID: string, entityType: CommentEntity): Promise<number> {
    logger.debug('comment.service.comments-count.start')
    return TrxUtility.transactional<number>(this.db, async trxProvider => {
      const count = await this.dao.countComments(trxProvider, entityUID, entityType)
      logger.debug('comment.service.comments-count.done')
      return count
    })
  }
}
