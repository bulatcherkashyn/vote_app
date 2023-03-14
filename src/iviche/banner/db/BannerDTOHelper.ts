import { Banner } from '../model/Banner'
import { BannerList } from '../model/BannerList'
import { BannerPositions } from '../model/BannerPositions'
import { DbBanner } from '../model/DbBanner'

export class BannerDTOHelper {
  public static fromDBToBannerList(array: Array<DbBanner>): BannerList {
    const map = new Map<BannerPositions, Array<Banner>>()
    Object.values(BannerPositions).forEach(el => {
      const filtered: Array<DbBanner> = array.filter(
        banner => banner.position === el && banner.showBanner,
      )
      const convertedToDTO: Array<Banner> = filtered.map(
        ({ uuid, title, description, link, urlImageBanner }) => ({
          uuid,
          title,
          description,
          link,
          urlImageBanner,
        }),
      )
      map.set(el, el === BannerPositions.AFTER_NEWS ? convertedToDTO.reverse() : convertedToDTO)
    })
    return Object.freeze(Object.fromEntries(map) as BannerList)
  }
}
