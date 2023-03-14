import { GenericEntity } from '../../generic/model/GenericEntity'
import { PollStatus } from './PollStatus'

export interface NotificationPollData extends GenericEntity {
  title: string
  body: string
  authorUID: string
  status: PollStatus
}
