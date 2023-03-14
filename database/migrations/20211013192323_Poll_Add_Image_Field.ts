import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('poll', table => {
    table.uuid('image').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('poll', table => {
    table.dropColumn('image')
  })
}
