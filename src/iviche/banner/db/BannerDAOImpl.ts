import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { logger } from '../../logger/LoggerFactory'
import { BannerList } from '../model/BannerList'
import { DbBanner } from '../model/DbBanner'
import { WpBanner } from '../model/WpBanner'
import { BannerDAO } from './BannerDAO'
import { BannerDTOHelper } from './BannerDTOHelper'

export class BannerDAOImpl implements BannerDAO {
  public async create(trxProvider: TrxProvider, banner: DbBanner): Promise<string> {
    logger.debug('banner.dao.create.start')
    const trx = await trxProvider()
    await trx('banner').insert({
      uid: banner.uuid,
      title: banner.title,
      description: banner.description,
      showBanner: banner.showBanner,
      link: banner.link,
      position: banner.position,
      urlImageBanner: banner.urlImageBanner,
      imageUid: banner.imageUid,
      createdAt: DateUtility.now(),
    })

    logger.debug('banner.dao.create.done')
    return banner.uuid as string
  }

  public async update(trxProvider: TrxProvider, banner: DbBanner): Promise<void> {
    logger.debug('banner.dao.update.start')
    const trx = await trxProvider()

    const result = await trx('banner')
      .where({ uid: banner.uuid })
      .update({
        title: banner.title,
        description: banner.description,
        showBanner: banner.showBanner,
        link: banner.link,
        position: banner.position,
        urlImageBanner: banner.urlImageBanner,
        imageUid: banner.imageUid,
        createdAt: DateUtility.now(),
      })

    checkDAOResult(result, 'banner', 'update')
    logger.debug('banner.dao.update.done')
  }

  public async delete(trxProvider: TrxProvider, uuid: string): Promise<void> {
    logger.debug('banner.dao.delete.start')
    const trx = await trxProvider()

    const result = await trx('banner')
      .where({ uid: uuid })
      .delete()

    checkDAOResult(result, 'banner', 'delete')
    logger.debug('banner.dao.delete.done')
  }

  public async getByUid(trxProvider: TrxProvider, bannerUid: string): Promise<DbBanner> {
    logger.debug('banner.dao.getById.start')

    const trx = await trxProvider()

    const result = await trx<WpBanner>('banner')
      .where({ uid: bannerUid })
      .first(
        'banner.uid as uuid',
        'banner.title',
        'banner.description',
        'banner.link',
        'banner.position',
        'banner.urlImageBanner',
        'banner.showBanner',
        'banner.imageUid',
        'banner.createdAt',
      )
    logger.debug('banner.dao.getById.done')
    return result
  }

  public async list(trxProvider: TrxProvider): Promise<BannerList> {
    logger.debug('banner.dao.list.start')

    const trx = await trxProvider()

    const result = await trx<WpBanner>('banner').select(
      'banner.uid as uuid',
      'banner.title',
      'banner.description',
      'banner.link',
      'banner.position',
      'banner.urlImageBanner',
      'banner.showBanner',
    )
    logger.debug('banner.dao.list.done')
    return BannerDTOHelper.fromDBToBannerList(result)
  }
}
