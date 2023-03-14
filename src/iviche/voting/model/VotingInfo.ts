import { VotingRoundType } from './VotingRoundType'

export interface VoteInfo {
  readonly createdAt: Date
  readonly answerUid: string
  readonly votingRound: VotingRoundType
}
