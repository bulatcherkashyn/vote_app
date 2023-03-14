import * as Knex from 'knex'

import { Language } from '../../src/iviche/common/Language'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table
      .enum('language', Object.values(Language))
      .notNullable()
      .defaultTo(Language.UA)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table.dropColumn('language')
  })
}
