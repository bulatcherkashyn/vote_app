import { List } from 'immutable'

import { VotingResult } from '../../voting/model/VotingResult'

export interface PollVotingResultService {
  create(votingResults: Array<VotingResult>): Promise<void>

  list(pollUID: string): Promise<List<VotingResult>>

  cleanAnswerValueStatistics(pollUID: string): Promise<void>
}
