import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { apiServerURL } from '../../../../config/serverURLConfig'
import { TrxUtility } from '../../db/TrxUtility'
import { logger } from '../../logger/LoggerFactory'
import { ImageEntity } from '../../media/image/model/Image'
import { ImageStorage } from '../../media/image/service/ImageStorage'
import { BannerDAO } from '../db/BannerDAO'
import { BannerList } from '../model/BannerList'
import { BannerPositions } from '../model/BannerPositions'
import { DbBanner } from '../model/DbBanner'
import { WpBanner } from '../model/WpBanner'
import { BannerService } from './BannerService'

@injectable()
export class BannerServiceImpl implements BannerService {
  constructor(
    @inject('BannerDAO') private dao: BannerDAO,
    @inject('DBConnection') private db: Knex,
    @inject('ImageStorage') private imageStorage: ImageStorage,
  ) {}

  private async makeImageUrl(imageUid: string): Promise<string> {
    return apiServerURL + '/images/' + imageUid
  }

  public async create(banner: WpBanner): Promise<string> {
    logger.debug('banner.service.create.start')
    return TrxUtility.transactional<string>(this.db, async trxProvider => {
      if (!banner.urlImageBanner) {
        throw new Error('banner.service.no-wp-url.error')
      }
      let imageUID
      if (
        banner.position === BannerPositions.POPUP_BOTTOM ||
        banner.position === BannerPositions.POPUP_CENTER
      ) {
        imageUID = await this.imageStorage.saveFromUrl(banner.urlImageBanner, ImageEntity.polls) // for popups we decided to use same image size as for polls
      } else {
        imageUID = await this.imageStorage.saveFromUrl(banner.urlImageBanner, ImageEntity.banner)
      }
      const url = await this.makeImageUrl(imageUID)
      const newBanner: DbBanner = { ...banner, urlImageBanner: url, imageUid: imageUID }
      const uid = await this.dao.create(trxProvider, newBanner)
      logger.debug('banner.service.create.done')
      return uid
    })
  }

  public async update(banner: WpBanner): Promise<void> {
    logger.debug('banner.service.update.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      const existingBanner = await this.dao.getByUid(trxProvider, banner.uuid)
      if (!existingBanner) {
        logger.debug('banner.service.update.not-existing.error')
        return
      }
      const imageUrl = await this.makeImageUrl(existingBanner.imageUid)
      await this.imageStorage.updateFromUrl(
        existingBanner.imageUid,
        existingBanner.urlImageBanner,
        ImageEntity.banner,
      )
      const updatedBanner: DbBanner = {
        ...banner,
        urlImageBanner: imageUrl,
        imageUid: existingBanner.imageUid,
      }
      await this.dao.update(trxProvider, updatedBanner)
      logger.debug('banner.service.update.done')
    })
  }

  public async delete(uid: string): Promise<void> {
    logger.debug('banner.service.delete.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      const existingBanner = await this.dao.getByUid(trxProvider, uid)
      if (!existingBanner) {
        logger.debug('banner.service.delete.not-existing.error')
        return
      }
      await this.imageStorage.delete(existingBanner.imageUid)
      await this.dao.delete(trxProvider, uid)
      logger.debug('banner.service.delete.done')
    })
  }

  public async list(): Promise<BannerList> {
    logger.debug('banner.service.list.start')

    return TrxUtility.transactional<BannerList>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider)
      logger.debug('banner.service.list.done')
      return list
    })
  }
}
