import { List } from 'immutable'

import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { Theme } from '../../common/Theme'
import { GenericEntity } from '../../generic/model/GenericEntity'
import { AgeGroup } from './AgeGroup'
import { PollAnswer } from './PollAnswer'
import { PollStatus } from './PollStatus'
import { PollType } from './PollType'

export interface Poll extends GenericEntity {
  readonly theme: Theme
  readonly complexWorkflow: boolean
  readonly anonymous: boolean
  readonly status?: PollStatus
  readonly title: string
  readonly body: string
  readonly createdAt?: Date
  readonly publishedAt?: Date
  readonly discussionStartAt?: Date
  readonly votingStartAt: Date
  readonly votingEndAt: Date
  readonly tags: List<string>
  readonly competencyTags: List<string>
  readonly taAgeGroups: List<AgeGroup>
  readonly taGenders: List<Gender>
  readonly taSocialStatuses: List<SocialStatus>
  readonly taAddressRegion: Region
  readonly taAddressDistrict?: string
  readonly taAddressTown?: string
  readonly answers: List<PollAnswer>
  readonly authorUID: string
  readonly answersCount?: number
  readonly votesCount?: number
  readonly commentsCount?: number
  readonly isHidden?: boolean
  readonly pollType: PollType
  readonly image?: string
}
