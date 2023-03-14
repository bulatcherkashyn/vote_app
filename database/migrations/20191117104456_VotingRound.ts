import * as Knex from 'knex'

import { Gender } from '../../src/iviche/common/Gender'
import { Region } from '../../src/iviche/common/Region'
import { SocialStatus } from '../../src/iviche/common/SocialStatus'
import { AgeGroup } from '../../src/iviche/polls/models/AgeGroup'
import { StatisticsType } from '../../src/iviche/statistics/model/StatisticsType'
import { VotingRoundType } from '../../src/iviche/voting/model/VotingRoundType'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('voting_round', table => {
    // NOTE: voting_round.uid refers to poll.uid 1-to-1
    // however, there is no constraint to polls table,
    // since this block will be moved to a separate DB
    table
      .uuid('uid')
      .index('uid')
      .unique()

    table.enum('type', Object.values(VotingRoundType)).defaultTo(VotingRoundType.VOTING)
    table.dateTime('createdAt')
    table.dateTime('startedAt')
    table.dateTime('endedAt')
  })

  await knex.schema.createTable('vote', table => {
    // NOTE: voting_round.uid refers to pollAnswer.uid 1-to-1
    // however, there is no constraint to polls table,
    // since this block will be moved to a separate DB
    table.uuid('pollAnswerUID')
    // NOTE: vote.votingRoundUID refers to voting_round.uid what poll.uid 1-to-1
    // however, there is no constraint to polls table,
    // since this block will be moved to a separate DB
    table.uuid('votingRoundUID').references('voting_round.uid')

    table
      .string('voterSeed', 128)
      .unique()
      .index()
    table.enum('roundStatus', Object.values(VotingRoundType))

    table.dateTime('createdAt').defaultTo(knex.fn.now())

    table.enum('ageGroup', Object.values(AgeGroup)).notNullable()
    table.enum('gender', Object.values(Gender)).notNullable()
    table.enum('socialStatus', Object.values(SocialStatus)).notNullable()

    table.enum('addressRegion', Object.values(Region)).notNullable()
    table.string('addressDistrict', 64)
    table.string('addressTown', 64)

    table.unique(['votingRoundUID', 'voterSeed'], 'voter_seed_per_round_uniqueness')
  })

  await knex.schema.createTable('voting_result', table => {
    table.uuid('votingRoundUID').references('voting_round.uid')

    table.enum('statisticsType', Object.values(StatisticsType))
    table.string('key0', 128)
    table.string('key1', 128)
    table.string('key2', 128)
    table.text('value')

    table.boolean('finalAggregation')
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('voting_result')
  await knex.schema.dropTable('vote')
  await knex.schema.dropTable('voting_round')
}
