import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table
      .boolean('notifyAboutNewPoll')
      .notNullable()
      .defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table.dropColumn('notifyAboutNewPoll')
  })
}
