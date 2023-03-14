import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { Theme } from '../../common/Theme'
import { GenericEntity } from '../../generic/model/GenericEntity'
import { AuthorData } from '../../person/model/AuthorData'
import { AgeGroup } from '../models/AgeGroup'
import { PollAnswer } from '../models/PollAnswer'
import { PollStatus } from '../models/PollStatus'
import { PollType } from '../models/PollType'

export interface MutablePollDTO extends GenericEntity {
  theme: Theme
  complexWorkflow: boolean
  anonymous: boolean
  status: PollStatus
  title: string
  body: string
  createdAt?: Date
  publishedAt?: Date
  discussionStartAt?: Date
  votingStartAt: Date
  votingEndAt: Date
  tags: Array<string>
  competencyTags: Array<string>
  taAgeGroups: Array<AgeGroup>
  taGenders: Array<Gender>
  taAddressRegion: Region
  taAddressDistrict?: string
  taAddressTown?: string
  taSocialStatuses: Array<SocialStatus>
  authorUID: string
  answers: Array<PollAnswer>
  answersCount: number
  votesCount: number
  commentsCount: number
  isHidden: boolean
  pollType: PollType
  authorData: AuthorData
  image?: string
}
