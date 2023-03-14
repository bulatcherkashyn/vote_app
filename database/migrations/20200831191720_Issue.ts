import * as Knex from 'knex'

import { IssueReferenceType } from '../../src/iviche/issue/model/IssueReferenceType'
import { IssueResolution } from '../../src/iviche/issue/model/IssueResolution'
import { IssueType } from '../../src/iviche/issue/model/IssueType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('issue', table => {
    table.uuid('uid').primary()
    table
      .enum('type', Object.values(IssueType))
      .notNullable()
      .index()
    table.string('body').notNullable()
    table
      .enum('resolution', Object.values(IssueResolution))
      .defaultTo(IssueResolution.PENDING)
      .index()
    table.string('comment')
    table.enum('referenceObjectType', Object.values(IssueReferenceType))
    table.uuid('reference')
    table.uuid('userUID')
    table.string('issuerEmail')
    table.dateTime('createdAt')
    table.dateTime('resolvedAt')
    table
      .uuid('moderatorUID')
      .references('users.uid')
      .nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('issue')
}
