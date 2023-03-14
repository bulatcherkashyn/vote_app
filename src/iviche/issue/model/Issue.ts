import { Comment } from '../../comment/model/Comment'
import { News } from '../../news/model/News'
import { AuthorData, ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { Person } from '../../person/model/Person'
import { Poll } from '../../polls/models/Poll'
import { PollAnswer } from '../../polls/models/PollAnswer'
import { IssueReferenceType } from './IssueReferenceType'
import { IssueResolve } from './IssueResolve'
import { IssueType } from './IssueType'

export type IssueReferenceObjectType = Person | PollAnswer | Poll | Comment | News | undefined

export type IssueReferenceObjectWithAuthor = {
  object?: ObjectWithAuthorDataObject<IssueReferenceObjectType>
  authorData?: AuthorData
}

export interface Issue extends IssueResolve {
  readonly type: IssueType
  readonly body: string
  readonly reference?: string
  readonly referencedObject?: ObjectWithAuthorDataObject<IssueReferenceObjectType>
  readonly referenceObjectType?: IssueReferenceType
  readonly authorData?: AuthorData
  readonly userUID?: string
  readonly issuerEmail?: string
  readonly createdAt?: Date
  readonly resolvedAt?: Date
}
