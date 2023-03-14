import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { Elastic } from './Elastic'

export class ElasticModule {
  static async initialize(): Promise<void> {
    container.registerSingleton<Elastic>('Elastic', Elastic)
    logger.debug('app.context.elastic.module.initialized')
  }
}
