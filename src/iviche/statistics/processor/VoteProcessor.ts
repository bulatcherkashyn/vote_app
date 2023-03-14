import { Vote } from '../../voting/model/Vote'
import { StatisticsType } from '../model/StatisticsType'

export interface VoteProcessor {
  consume(vote: Vote): void
  getAggregation(): Map<string, Map<string, number>>
  getStatisticsType(): StatisticsType
}
