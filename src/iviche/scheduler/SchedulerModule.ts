import { container } from 'tsyringe'

import { EnvironmentMode } from '../common/EnvironmentMode'
import { logger } from '../logger/LoggerFactory'
import { SchedulerRegistry } from './SchedulerRegistry'
import { SchedulerRegistryImpl } from './SchedulerRegistryImpl'

export class SchedulerModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('SchedulerRegistry', SchedulerRegistryImpl)

    if (EnvironmentMode.isDevelopment()) {
      const schedulerRegistry = container.resolve<SchedulerRegistry>('SchedulerRegistry')
      schedulerRegistry.initialize()
    }
    logger.debug('app.context.scheduler.module.initialized')
  }
}
