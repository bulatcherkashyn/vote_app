import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { LocationService } from './service/LocationService'

export class LocationModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('LocationService', LocationService)
    logger.debug('app.context.location.module.initialized')
  }
}
