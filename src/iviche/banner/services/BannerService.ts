import { BannerList } from '../model/BannerList'
import { WpBanner } from '../model/WpBanner'

export interface BannerService {
  create(banner: WpBanner): Promise<string>

  update(banner: WpBanner): Promise<void>

  delete(uid: string): Promise<void>

  list(): Promise<BannerList>
}
