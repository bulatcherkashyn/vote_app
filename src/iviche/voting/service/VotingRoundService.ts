import { VotingRound } from '../model/VotingRound'

export interface VotingRoundService {
  get(pollUID: string): Promise<VotingRound>
}
