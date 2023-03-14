import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auth_data', table => {
    table.string('deviceToken')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auth_data', table => {
    table.dropColumn('deviceToken')
  })
}
