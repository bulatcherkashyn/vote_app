import 'reflect-metadata'

import * as Knex from 'knex'

import { IndexQueueStatus } from '../../indexTaskQueue/model/IndexQueueStatus'
import { IndexTask, ReferenceType } from '../../indexTaskQueue/model/IndexTask'
import { logger } from '../../logger/LoggerFactory'
import { NewsDataExtractor } from './extractor/NewsDataExtractor'
import { PollDataExtractor } from './extractor/PollDataExtractor'
import { IndexDataExtractor } from './IndexDataExtractor'

type ObjectOfReferences = { [key in ReferenceType]: { [key in string]: IndexTask } }

const mapping: { [key in ReferenceType]: IndexDataExtractor } = {
  [ReferenceType.POLL]: new PollDataExtractor(),
  [ReferenceType.NEWS]: new NewsDataExtractor(),
}

// ['a', 'b'] -> { a: {}, b: {} } also it removed repeated element
const createObjectOfReferences = (tasks: Array<IndexTask>): ObjectOfReferences => {
  const referenceTypes = Object.values(ReferenceType)

  const objectOfReferences = referenceTypes.reduce(
    (accum, curr) => ((accum[curr] = {}), accum),
    {} as { [key in ReferenceType]: { [key in string]: IndexTask } },
  )

  for (const task of tasks) {
    objectOfReferences[task.referenceType][task.referenceUID] = task
  }

  return objectOfReferences
}

const index = async (knexConnection: Knex): Promise<void> => {
  const tasks = await knexConnection<IndexTask>('index_task')
    .select('*')
    .orderBy('createdAt', 'asc')
    .limit(1000)

  const objectOfReferences = createObjectOfReferences(tasks)

  for (const ref in objectOfReferences) {
    const taskArray = Object.values(objectOfReferences[ref as ReferenceType])
    await mapping[ref as ReferenceType].exec(knexConnection, taskArray)
  }
  const tasksUIDs = tasks.map(task => task.uid)
  await knexConnection('index_task')
    .del()
    .whereIn('uid', tasksUIDs)
}

export const elasticIndexer = async (knexConnection: Knex): Promise<void> => {
  try {
    const updates = await knexConnection('index_queue_status')
      .update({
        status: IndexQueueStatus.IN_PROGRESS,
      })
      .where({ status: IndexQueueStatus.PENDING })

    if (updates === 0) {
      return
    }
    await index(knexConnection)
  } catch (e) {
    logger.error('elastic-indexer-job ', e)
  } finally {
    await knexConnection('index_queue_status').update({
      status: IndexQueueStatus.PENDING,
    })
    knexConnection.destroy()
  }
}
