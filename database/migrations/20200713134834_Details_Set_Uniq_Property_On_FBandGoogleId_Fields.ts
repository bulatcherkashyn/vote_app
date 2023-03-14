import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table
      .string('googleId')
      .unique()
      .alter()
    table
      .string('facebookId')
      .unique()
      .alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_details')
}
