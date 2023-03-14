import * as Knex from 'knex'

import { CommentEntity } from '../../src/iviche/comment/model/CommentEntity'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('comment', table => {
    table.uuid('uid').primary()
    table.enum('entityType', Object.values(CommentEntity)).notNullable()
    table.string('entityUID').notNullable()

    table.uuid('threadUID').notNullable()
    table.uuid('parentUID')

    table.text('text').notNullable()

    table
      .integer('likesCounter')
      .notNullable()
      .defaultTo(0)
    table
      .integer('dislikesCounter')
      .notNullable()
      .defaultTo(0)
    table
      .jsonb('ratedBy')
      .notNullable()
      .defaultTo('{}')

    table.jsonb('reports').defaultTo('{}')
    table.dateTime('createdAt')
    table.uuid('authorUID').notNullable()
  })

  await knex.schema.alterTable('comment', table => {
    table
      .foreign('threadUID')
      .references('comment.uid')
      .onDelete('CASCADE')
    table
      .foreign('parentUID')
      .references('comment.uid')
      .onDelete('CASCADE')

    table.foreign('authorUID').references('users.uid')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('comment')
}
