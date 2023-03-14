import { Application } from 'express'
import * as Knex from 'knex'
import { container } from 'tsyringe'

import { App } from '../../../src/App'
import { AppContext } from '../../../src/AppContext'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { logger } from '../../../src/iviche/logger/LoggerFactory'
import TestDBModule from '../../database/TestDBModule'
import { MockFirebasePushNotificationFunction } from './MockFirebasePushNotificationFunction'
import { MockNotificationModule } from './MockNotificationService'
import { MockTelegramBotModule } from './MockTelegramBotService'

export class TestContext {
  private static initialized = false
  static app: Application

  static async initialize(seeds?: Array<(knex: Knex) => Promise<void>>): Promise<void> {
    if (!TestContext.initialized) {
      await AppContext.initialize()
      const elastic = container.resolve<Elastic>('Elastic')
      await elastic.clearAll()
      await TestDBModule.initialize(seeds)
      await MockNotificationModule.initialize()
      await MockTelegramBotModule.initialize()
      MockFirebasePushNotificationFunction.initialize()

      TestContext.app = new App().application

      TestContext.initialized = true
      logger.info('test.context.initialized')
    }
  }

  static async close(): Promise<void> {
    await TestDBModule.close()
  }
}
