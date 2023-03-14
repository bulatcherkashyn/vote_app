import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { BannerDAOImpl } from './db/BannerDAOImpl'
import { BannerServiceImpl } from './services/BannerServiceImpl'

export class BannerModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('BannerDAO', BannerDAOImpl)
    container.registerSingleton('BannerService', BannerServiceImpl)
    logger.debug('app.context.banner.module.initialized')
  }
}
