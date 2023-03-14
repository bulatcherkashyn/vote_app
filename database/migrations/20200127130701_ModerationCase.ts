import * as Knex from 'knex'

import { ModerationResolutionType } from '../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationType } from '../../src/iviche/moderation/model/ModerationType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('moderation_case', table => {
    table.uuid('uid').primary()
    table.enum('type', Object.values(ModerationType)).notNullable()
    table.uuid('reference').notNullable()
    table
      .enum('resolution', Object.values(ModerationResolutionType))
      .defaultTo(ModerationResolutionType.PENDING)
    table.string('concern')
    table.string('summary')
    table
      .integer('lockingCounter')
      .notNullable()
      .defaultTo(0)

    table.dateTime('createdAt')
    table.dateTime('resolvedAt')
    table
      .uuid('moderatorUID')
      .references('users.uid')
      .nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('moderation_case')
}
