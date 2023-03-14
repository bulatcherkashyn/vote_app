import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex('auth_data').truncate()
  await knex.schema.alterTable('auth_data', table => {
    table
      .string('deviceToken')
      .notNullable()
      .alter()
    table.string('firebaseDeviceToken')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('auth_data', table => {
    table.dropColumn('firebaseDeviceToken')
  })
  await knex.schema.raw(`
    ALTER TABLE auth_data
    ALTER COLUMN "deviceToken" DROP NOT NULL,
  `)
}
