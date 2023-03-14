import { List } from 'immutable'

import { TrxProvider } from '../../db/TrxProvider'
import { VotingResult } from '../../voting/model/VotingResult'

export interface PollVotingResultDAO {
  create(trxProvider: TrxProvider, votingResults: Array<VotingResult>): Promise<void>

  list(trxProvider: TrxProvider, pollUID: string): Promise<List<VotingResult>>

  cleanAnswerValueStatistics(trxProvider: TrxProvider, pollUID: string): Promise<void>
}
