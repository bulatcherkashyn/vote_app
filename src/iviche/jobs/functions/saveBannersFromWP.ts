import axios, { AxiosResponse } from 'axios'
import * as Knex from 'knex'

import { BannerDAOImpl } from '../../banner/db/BannerDAOImpl'
import { WpBanner } from '../../banner/model/WpBanner'
import { BannerServiceImpl } from '../../banner/services/BannerServiceImpl'
import { EnvironmentMode } from '../../common/EnvironmentMode'
import { logger } from '../../logger/LoggerFactory'
import { ImageStorageDaoImpl } from '../../media/image/db/ImageStorageDaoImpl'
import { ImageStorageImpl } from '../../media/image/service/ImageStorageImpl'

interface BannersWpSync {
  uuid: string
}

async function getBannerDataFromWP(): Promise<Array<WpBanner> | undefined> {
  const WP_LIST_BANNER_URL = `${process.env.WP_URL}/banner`
  try {
    const request: AxiosResponse = await axios.get(WP_LIST_BANNER_URL)

    if (request.status !== 200) {
      logger.error(`save-banners-from-wp.job.api.error[request.status:${request.status}]`)
      return
    }
    return request.data as Array<WpBanner>
  } catch (e) {
    logger.error(`save-banners-from-wp.job.api.axios.error`, e)
  }
}

async function getExistingBannersFromDb(
  knexConnection: Knex,
  bannersUuid: Array<string>,
): Promise<Array<BannersWpSync> | void> {
  return knexConnection<BannersWpSync | undefined>('banner')
    .select('banner.uid as uuid')
    .whereIn('uid', bannersUuid)
}

async function getUnnecessaryBannersInDb(
  knexConnection: Knex,
  bannersUuid: Array<string>,
): Promise<Array<BannersWpSync> | void> {
  return knexConnection<BannersWpSync | undefined>('banner')
    .select('banner.uid as uuid')
    .whereNotIn('uid', bannersUuid)
}

async function deleteBannersInDb(
  knexConnection: Knex,
  unnecessaryBanners: Array<BannersWpSync>,
): Promise<void> {
  const bannersService = new BannerServiceImpl(
    new BannerDAOImpl(),
    knexConnection,
    new ImageStorageImpl(new ImageStorageDaoImpl(knexConnection)),
  )

  for (const banner of unnecessaryBanners) {
    try {
      await bannersService.delete(banner.uuid)
    } catch (error) {
      logger.error('save-banner-from-wp.job.delete.error:', error)
    }
  }
}

async function saveOrUpdateBannersInDb(
  knexConnection: Knex,
  existingInDbBanners: Array<BannersWpSync>,
  wpBannersList: Array<WpBanner>,
): Promise<void> {
  const bannersService = new BannerServiceImpl(
    new BannerDAOImpl(),
    knexConnection,
    new ImageStorageImpl(new ImageStorageDaoImpl(knexConnection)),
  )

  for (const wpBanner of wpBannersList) {
    const existingBanner = existingInDbBanners.find(bannerSyncInfo => {
      return bannerSyncInfo.uuid === wpBanner.uuid
    })

    if (!existingBanner) {
      try {
        await bannersService.create(wpBanner)
      } catch (error) {
        logger.error('save-banner-from-wp.job.create.error:', error)
      }
    }
  }
}

export const saveBannersFromWp = async (dbConnection: Knex): Promise<void> => {
  const PROCESS_EXIT_ERROR = -322
  try {
    const wpBannersList: Array<WpBanner> | undefined = await getBannerDataFromWP()

    if (!wpBannersList) {
      await dbConnection.destroy()
      return
    }

    const wpBannersUuid: Array<string> = wpBannersList.map((wpBanner: WpBanner) => wpBanner.uuid)
    const existingInDb: Array<BannersWpSync> =
      (await getExistingBannersFromDb(dbConnection, wpBannersUuid)) || []
    const unnecessaryBanners = (await getUnnecessaryBannersInDb(dbConnection, wpBannersUuid)) || []

    await deleteBannersInDb(dbConnection, unnecessaryBanners)
    await saveOrUpdateBannersInDb(dbConnection, existingInDb, wpBannersList)
  } catch (error) {
    await dbConnection.destroy()
    logger.error('save-banners-from-wp.job.error:', error)
    if (!EnvironmentMode.isTest()) {
      process.exit(PROCESS_EXIT_ERROR)
    }
  }
  await dbConnection.destroy()
}
