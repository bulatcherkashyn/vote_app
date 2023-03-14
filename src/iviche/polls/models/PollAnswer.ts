import { GenericEntity } from '../../generic/model/GenericEntity'
import { AuthorData } from '../../person/model/AuthorData'
import { PollAnswerStatus } from './PollAnswerStatus'

export interface PollAnswer extends GenericEntity {
  readonly basic: boolean
  readonly index: number
  readonly status?: PollAnswerStatus
  readonly title: string
  readonly createdAt?: Date
  readonly authorUID: string
  readonly pollUID: string
  readonly authorData?: AuthorData
}
