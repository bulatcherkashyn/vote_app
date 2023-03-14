import { TrxProvider } from '../../db/TrxProvider'
import { Vote } from '../model/Vote'
import { VoteInfo } from '../model/VotingInfo'

export type VotesCount = {
  uid: string
  count: number
}

export interface VoteDAO {
  create(trxProvider: TrxProvider, vote: Vote): Promise<void>

  updatePartial(trxProvider: TrxProvider, voterSeed: string, vote: Partial<Vote>): Promise<void>

  getVoteInfo(trxProvider: TrxProvider, uid: string): Promise<VoteInfo | undefined>

  listByVotingRoundUID(trxProvider: TrxProvider, votingRoundUID: string): Promise<Array<Vote>>

  countVotesPerAnswer(trxProvider: TrxProvider, pollUID: string): Promise<Array<VotesCount>>

  getByVoterSeed(trxProvider: TrxProvider, voterSeed: string): Promise<Vote>
}
