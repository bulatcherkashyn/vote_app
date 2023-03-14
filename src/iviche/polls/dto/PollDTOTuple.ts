import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { Theme } from '../../common/Theme'
import { AuthorDataQueryTuple } from '../../person/model/AuthorData'
import { AgeGroup } from '../models/AgeGroup'
import { PollAnswerStatus } from '../models/PollAnswerStatus'
import { PollStatus } from '../models/PollStatus'
import { PollType } from '../models/PollType'

export interface PollDTOTuple extends AuthorDataQueryTuple {
  readonly uid: string
  readonly theme: Theme
  readonly complexWorkflow: boolean
  readonly anonymous: boolean
  readonly status: PollStatus
  readonly title: string
  readonly body: string
  readonly createdAt?: Date
  readonly publishedAt?: Date
  readonly discussionStartAt?: Date
  readonly votingStartAt: Date
  readonly votingEndAt: Date
  readonly tags: Array<string>
  readonly competencyTags: Array<string>
  readonly taAgeGroups: Array<AgeGroup>
  readonly taGenders: Array<Gender>
  readonly authorUID: string
  readonly taSocialStatuses: Array<SocialStatus>
  readonly taAddressRegion: Region
  readonly taAddressDistrict?: string
  readonly taAddressTown?: string
  readonly answersCount: number
  readonly votesCount: number
  readonly commentsCount: number
  readonly isHidden: boolean
  readonly pollType: PollType
  readonly answerUid: string
  readonly answerBasic: boolean
  readonly answerStatus: PollAnswerStatus
  readonly answerTitle: string
  readonly answerCreatedAt: Date
  readonly answerAuthorUID: string
  readonly answerIndex: number
  readonly image?: string
}
