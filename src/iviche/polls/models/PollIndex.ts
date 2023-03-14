import { Region } from '../../common/Region'
import { Theme } from '../../common/Theme'
import { PollType } from './PollType'

export interface PollIndex {
  uid: string
  body: string
  theme: Theme
  title: string
  tags: string
  authorUID: string
  pollType: PollType
  status?: string
  competencyTags: string
  publishedAt?: string
  taAddressRegion?: Region
  taAddressDistrict?: string
}
