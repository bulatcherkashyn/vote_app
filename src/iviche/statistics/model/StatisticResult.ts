import { VotingResult } from '../../voting/model/VotingResult'
import { StatisticsType } from './StatisticsType'

export type StatisticsResult = {
  [key in StatisticsType]?: Array<VotingResult>
}
