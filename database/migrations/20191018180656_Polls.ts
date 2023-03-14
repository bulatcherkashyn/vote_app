import * as Knex from 'knex'

import { Theme } from '../../src/iviche/common/Theme'
import { PollAnswerStatus } from '../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../src/iviche/polls/models/PollStatus'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('poll', table => {
    table.uuid('uid').primary()
    table.enum('theme', Object.values(Theme)).defaultTo(Theme.OTHER)
    table.boolean('complexWorkflow').defaultTo(false)
    table.boolean('anonymous').defaultTo(true)
    table
      .enum('status', Object.values(PollStatus))
      .defaultTo(PollStatus.DRAFT)
      .index() // Note: We use Status in ACS, so we need index here

    table.string('title', 255)
    table.text('body')
    table.dateTime('createdAt')
    // Note: We do sort by publishedAt, so we need this index
    table.dateTime('publishedAt').index()

    table.dateTime('discussionStartAt')
    table.dateTime('votingStartAt')
    table.dateTime('votingEndAt')
    table.json('tags')
    table.json('competencyTags')
    table.json('taAgeGroups')
    table.json('taGenders')
    table.json('taSocialStatuses')
    table.string('taAddressRegion', 64)
    table.string('taAddressDistrict', 64)
    table.string('taAddressTown', 64)
    table
      .integer('answersCount')
      .notNullable()
      .defaultTo(0)

    table.integer('votesCount').defaultTo(0)
    table.integer('commentsCount').defaultTo(0)
    table.uuid('authorUID').references('users.uid')
  })

  await knex.schema.createTable('poll_answer', table => {
    table.uuid('uid').primary()
    table
      .boolean('basic')
      .notNullable()
      .defaultTo(true)
    table.integer('index')
    table.enum('status', Object.values(PollAnswerStatus)).defaultTo(PollAnswerStatus.MODERATION)
    table.string('title').notNullable()
    table.dateTime('createdAt')
    table.uuid('authorUID').references('users.uid')
    table.uuid('pollUID').references('poll.uid')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('poll_answer')
  await knex.schema.dropTable('poll')
}
