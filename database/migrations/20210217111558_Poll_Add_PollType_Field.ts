import * as Knex from 'knex'

import { PollType } from '../../src/iviche/polls/models/PollType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('poll', table => {
    table
      .enum('pollType', Object.values(PollType))
      .notNullable()
      .defaultTo(PollType.REGULAR)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('poll', table => {
    table.dropColumn('pollType')
  })
}
