import { TrxProvider } from '../../db/TrxProvider'
import { BannerList } from '../model/BannerList'
import { DbBanner } from '../model/DbBanner'
import { WpBanner } from '../model/WpBanner'

export interface BannerDAO {
  create(trxProvider: TrxProvider, banner: WpBanner): Promise<string>

  update(trxProvider: TrxProvider, banner: WpBanner): Promise<void>

  delete(trxProvider: TrxProvider, uid: string): Promise<void>

  list(trxProvider: TrxProvider): Promise<BannerList>

  getByUid(trxProvider: TrxProvider, uid: string): Promise<DbBanner>
}
