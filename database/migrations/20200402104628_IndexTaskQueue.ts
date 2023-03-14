import * as Knex from 'knex'

import { IndexQueueStatus } from '../../src/iviche/indexTaskQueue/model/IndexQueueStatus'
import { Action, ReferenceType } from '../../src/iviche/indexTaskQueue/model/IndexTask'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('index_task', table => {
    table.uuid('uid').primary()
    table.uuid('referenceUID').notNullable()
    table.enum('referenceType', Object.values(ReferenceType)).notNullable()
    table.enum('action', Object.values(Action)).notNullable()
    table.dateTime('createdAt').notNullable()
  })

  await knex.schema.createTable('index_queue_status', table => {
    table.enum('status', Object.values(IndexQueueStatus)).notNullable()
  })
  await knex('index_queue_status').insert({
    status: IndexQueueStatus.PENDING,
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('index_task')
  await knex.schema.dropTable('index_queue_status')
}
