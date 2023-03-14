import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { AgeGroup } from '../../polls/models/AgeGroup'
import { VotingRoundType } from './VotingRoundType'

export interface Vote {
  readonly pollAnswerUID: string
  readonly votingRoundUID: string

  readonly voterSeed: string
  readonly roundStatus: VotingRoundType

  readonly createdAt?: Date

  readonly ageGroup?: AgeGroup
  readonly gender?: Gender
  readonly socialStatus?: SocialStatus
  readonly addressRegion?: Region
  readonly addressDistrict?: string
  readonly addressTown?: string
}
