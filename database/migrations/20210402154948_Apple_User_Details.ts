import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table.string('appleId').unique()
    table.string('linkApple', 255)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table.dropColumn('appleId')
    table.dropColumn('linkApple')
  })
}
