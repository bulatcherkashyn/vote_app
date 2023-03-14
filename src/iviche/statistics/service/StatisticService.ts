import { Vote } from '../../voting/model/Vote'
import { VotingResult } from '../../voting/model/VotingResult'
import { StatisticsResult } from '../model/StatisticResult'
import { StatisticsHistogram } from '../model/StatisticsHistogram'

export interface StatisticService {
  getVotingResults(pollUID: string, votes: Array<Vote>): StatisticsResult

  buildAnswerValueStatistics(histogram: StatisticsHistogram, pollUID: string): VotingResult
}
