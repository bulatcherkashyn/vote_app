import { GenericEntity } from '../../generic/model/GenericEntity'
import { PollAnswerStatus } from './PollAnswerStatus'

export interface PollAnswerForm extends GenericEntity {
  readonly basic?: boolean
  readonly status?: PollAnswerStatus
  readonly index: number
  readonly title: string
  readonly createdAt?: Date
  readonly authorUID?: string
  readonly pollUID?: string
}
