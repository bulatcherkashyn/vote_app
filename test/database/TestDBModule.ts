import * as Knex from 'knex'
import { container } from 'tsyringe'

import { Elastic } from '../../src/iviche/elastic/Elastic'
import { logger } from '../../src/iviche/logger/LoggerFactory'

class TestDBModule {
  static async initialize(
    seeds?: Array<(knex: Knex, elastic?: Elastic) => Promise<void>>,
  ): Promise<void> {
    const knex = container.resolve<Knex>('DBConnection')
    const elastic = container.resolve<Elastic>('Elastic')

    await TestDBModule.initializeTestDB(knex)

    if (seeds) {
      await Promise.all(seeds.map(seed => seed(knex, elastic)))
    }

    logger.debug('test.context.database.initialized')
  }

  static async close(): Promise<void> {
    const knex = container.resolve<Knex>('DBConnection')

    await knex.destroy()

    logger.debug('test.context.database.closed')
  }

  private static async dropData(knexConn?: Knex): Promise<void> {
    const knex = knexConn || container.resolve<Knex>('DBConnection')
    await knex.raw('DROP SCHEMA public CASCADE;')
    await knex.raw('CREATE SCHEMA public;')
  }

  private static async initializeTestDB(knex: Knex): Promise<void> {
    await TestDBModule.dropData()
    await knex.migrate.latest()
  }
}

export default TestDBModule
