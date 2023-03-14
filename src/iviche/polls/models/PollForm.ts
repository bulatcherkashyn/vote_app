import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { GenericEntity } from '../../generic/model/GenericEntity'
import { PollAnswerForm } from './PollAnswerForm'
import { PollType } from './PollType'

// NOTE: Model without createdAt field
export interface PollForm extends GenericEntity {
  theme: string
  complexWorkflow?: boolean
  anonymous?: boolean
  draft: boolean
  title: string
  body?: string
  publishedAt?: string
  discussionStartAt?: string
  votingStartAt: string
  votingEndAt: string
  tags?: Array<string>
  competencyTags?: Array<string>
  taAddressRegion: Region
  taAddressDistrict?: string
  taAddressTown?: string
  taAgeGroups: Array<string>
  taGenders: Array<string>
  taSocialStatuses: Array<SocialStatus>
  authorUID?: string
  answers?: Array<PollAnswerForm>
  pollType: PollType
  image?: string
}
