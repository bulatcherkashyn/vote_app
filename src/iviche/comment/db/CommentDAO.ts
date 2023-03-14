import { TrxProvider } from '../../db/TrxProvider'
import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { Comment } from '../model/Comment'
import { CommentEntity } from '../model/CommentEntity'

export interface CommentDAO {
  get(trxProvider: TrxProvider, uid: string): Promise<Comment | undefined>

  saveOrUpdate(trxProvider: TrxProvider, entity: Comment, acs: ACS): Promise<string>

  getCommentThreads(
    trxProvider: TrxProvider,
    entityType: string,
    entityUID: string,
    userUID: string,
  ): Promise<Array<ObjectWithAuthorFields<Comment>>>

  delete(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<void>

  countComments(
    trxProvider: TrxProvider,
    entityUID: string,
    entityType: CommentEntity,
  ): Promise<number>
}
