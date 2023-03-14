import { ModerationInfoOfRejectedEntity } from '../../moderation/model/ModerationInfoOfRejectedPoll'
import { VoteInfo } from '../../voting/model/VotingInfo'
import { Poll } from './Poll'
import { PollAnswer } from './PollAnswer'

export interface PollDTOView extends Poll {
  readonly moderationInfo?: ModerationInfoOfRejectedEntity
  readonly voteInfo?: VoteInfo
  readonly answerInfo?: PollAnswer
}
