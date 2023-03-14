import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('competency_tag', table => {
    table.uuid('uid').primary()
    table
      .string('key', 128)
      .notNullable()
      .unique()
    table.string('email', 128)
    table.jsonb('title')
    table.text('contact')
    table.text('notes')
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('competency_tag')
}
