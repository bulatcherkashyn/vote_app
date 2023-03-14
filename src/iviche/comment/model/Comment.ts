import { GenericEntity } from '../../generic/model/GenericEntity'
import { CommentEntity } from './CommentEntity'

type RatedBy = { [ket: string]: 'liked' | 'disliked' }

export interface Comment extends GenericEntity {
  entityType?: CommentEntity
  entityUID?: string
  threadUID?: string
  parentUID?: string
  text?: string
  likesCounter?: number
  dislikesCounter?: number
  ratedBy?: RatedBy
  ratedAs?: string // how user rated this comment
  reports?: string
  createdAt?: Date
  authorUID?: string
}
