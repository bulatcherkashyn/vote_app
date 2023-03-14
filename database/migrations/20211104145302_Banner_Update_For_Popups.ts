import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('banner', table => {
    table.string('description', 255).nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('banner', table => {
    table.dropColumn('description')
  })
}
