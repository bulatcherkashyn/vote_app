import * as Knex from 'knex'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../src/iviche/common/utils/DateUtility'
import { Action, IndexTask, ReferenceType } from '../../src/iviche/indexTaskQueue/model/IndexTask'

export async function up(knex: Knex): Promise<void> {
  const polls = await knex('poll').select('uid')
  const indexTasks: Array<IndexTask> = polls.map(poll => ({
    uid: uuidv4(),
    referenceUID: poll.uid,
    referenceType: ReferenceType.POLL,
    createdAt: DateUtility.now(),
    action: Action.INDEX,
  }))
  await knex('index_task').insert(indexTasks)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(): Promise<void> {}
