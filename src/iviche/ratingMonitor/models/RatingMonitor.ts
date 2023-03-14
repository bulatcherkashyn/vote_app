import { Poll } from '../../polls/models/Poll'

export interface RatingMonitor extends Omit<Poll, 'votingEndAt'> {
  readonly votingEndAt?: Date
}
