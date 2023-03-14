import { Comment } from '../../comment/model/Comment'
import { AuthorData } from '../../person/model/AuthorData'
import { Person } from '../../person/model/Person'
import { Poll } from '../../polls/models/Poll'
import { PollAnswer } from '../../polls/models/PollAnswer'
import { ModerationResolve } from './ModerationResolve'
import { ModerationType } from './ModerationType'

export type ReferenceObjectType = Person | PollAnswer | Poll | Comment | undefined

export type ReferenceObjectWithAuthor = {
  object: ReferenceObjectType
  authorData?: AuthorData
}
export interface Moderation extends ModerationResolve {
  readonly type: ModerationType
  readonly reference: string
  readonly referencedObject?: ReferenceObjectType
  readonly authorData?: AuthorData
  readonly lockingCounter: number
  readonly summary: string
  readonly createdAt?: Date
  readonly resolvedAt?: Date
  readonly moderatorUID: string
}
