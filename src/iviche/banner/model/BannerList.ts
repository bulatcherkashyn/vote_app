import { Banner } from './Banner'
import { BannerPositions } from './BannerPositions'

export type BannerList = {
  [value in BannerPositions]: [Banner]
}
