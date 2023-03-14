import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { Comment } from '../model/Comment'
import { CommentEntity } from '../model/CommentEntity'

export interface CommentService {
  save(comment: Comment, acs: ACS): Promise<string>

  get(uid: string): Promise<Comment | undefined>

  getCommentThreads(
    entityType: string,
    entityUID: string,
    userUID: string,
  ): Promise<Array<ObjectWithAuthorFields<Comment>>>

  delete(uid: string, acs: ACS): Promise<void>

  countComments(entityUID: string, entityType: CommentEntity): Promise<number>
}
