import { VotesCount } from '../db/VoteDAO'
import { Vote } from '../model/Vote'
import { VoteInfo } from '../model/VotingInfo'

export interface VoteService {
  getVoteInfo(pollUID: string, userUID: string): Promise<VoteInfo | undefined>

  list(votingRoundUID: string): Promise<Array<Vote>>

  votesCount(pollUID: string): Promise<Array<VotesCount>>

  create(pollUID: string, answerUID: string, userUID: string): Promise<void>
}
