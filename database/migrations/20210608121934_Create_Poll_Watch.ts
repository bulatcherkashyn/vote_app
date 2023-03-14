import * as Knex from 'knex'

import { ContactType } from '../../src/iviche/pollWatch/models/ContactType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('poll_watch', table => {
    table.uuid('uid').primary()
    table.uuid('pollUID').references('poll.uid')
    table.string('pollTitle', 1024)
    table.uuid('userUID').references('users.uid')
    table.enum('contactType', Object.values(ContactType)).defaultTo(ContactType.MANUAL)
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('poll_watch')
}
