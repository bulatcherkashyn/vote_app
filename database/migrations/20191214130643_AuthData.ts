import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('auth_data', table => {
    table.uuid('uid').primary()
    table
      .string('username')
      .index()
      .notNullable()
    table.string('headerInfo').notNullable()
    table.string('refreshTokenHash').notNullable()
    table.dateTime('createdAt')
    table.foreign('username').references('users.username')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('auth_data')
}
