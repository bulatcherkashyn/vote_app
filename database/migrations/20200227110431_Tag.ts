import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tag', table => {
    table.uuid('uid').primary()
    table
      .string('value')
      .notNullable()
      .unique()
    table.dateTime('lastUseAt')
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tag')
}
