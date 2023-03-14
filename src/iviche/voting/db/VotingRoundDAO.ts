import { TrxProvider } from '../../db/TrxProvider'
import { Poll } from '../../polls/models/Poll'
import { VotingRound } from '../model/VotingRound'

export interface VotingRoundDAO {
  get(trxProvider: TrxProvider, pollUID: string): Promise<VotingRound>

  saveOrUpdateByPollStatus(trxProvider: TrxProvider, poll: Poll): Promise<void>
}
