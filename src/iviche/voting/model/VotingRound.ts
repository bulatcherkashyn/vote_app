import { GenericEntity } from '../../generic/model/GenericEntity'
import { VotingRoundType } from './VotingRoundType'

export interface VotingRound extends GenericEntity {
  readonly type: VotingRoundType
  readonly startedAt: Date
  readonly endedAt: Date
  readonly createdAt?: Date
}
