import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('image', table => {
    table.uuid('uid').primary()
    table.string('originalName').notNullable()
    table.string('entity').notNullable()
    table
      .boolean('isPublic')
      .notNullable()
      .defaultTo(false)
    table.string('mimeType').notNullable()
    table.binary('data').notNullable()
    table.dateTime('createdAt')
    table.uuid('ownerUID')
    table.foreign('ownerUID').references('users.uid')
  })

  await knex.schema.alterTable('person', table => {
    table.foreign('avatar').references('image.uid')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('person', table => {
    table.dropForeign(['avatar'])
  })
  await knex.schema.dropTable('image')
}
