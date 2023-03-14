import 'reflect-metadata'

import * as Knex from 'knex'

import { DBConnection } from '../../src/iviche/db/DBConnection'
import { Elastic } from '../../src/iviche/elastic/Elastic'
import { GeneratedDataWriter } from './02_TestData/GeneratedDataWriter'

export async function seed(knex: Knex, elastic: Elastic): Promise<void> {
  const writer = new GeneratedDataWriter(knex, elastic)
  await writer.writeData()
}

seed(new DBConnection().getConnection(), new Elastic())
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error('Seeding error:', e)
    process.exit(-1)
  })
