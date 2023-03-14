import { BannerPositions } from './BannerPositions'

export interface DbBanner {
  readonly uuid: string
  readonly title: string
  readonly description: string | null
  readonly showBanner: boolean
  readonly link: string
  readonly position: BannerPositions
  readonly urlImageBanner: string
  readonly imageUid: string
}
