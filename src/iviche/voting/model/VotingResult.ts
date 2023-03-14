import { StatisticsHistogram } from '../../statistics/model/StatisticsHistogram'
import { StatisticsType } from '../../statistics/model/StatisticsType'

export interface VotingResult {
  readonly votingRoundUID: string
  readonly statisticsType: StatisticsType

  readonly key0?: string
  readonly key1?: string
  readonly key2?: string
  readonly value: StatisticsHistogram

  readonly finalAggregation: boolean
  readonly createdAt: Date
}
