import { Action, IndexTask } from '../../../indexTaskQueue/model/IndexTask'
import { IndexDataExtractor } from '../IndexDataExtractor'
import Knex = require('knex')
import { PollUtility } from '../../../common/PollUtility'

export class PollDataExtractor extends IndexDataExtractor {
  public async index(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void> {
    const indexTasksUIDs = tasks
      .filter(task => task.action === Action.INDEX)
      .map(task => task.referenceUID)

    if (!indexTasksUIDs.length) {
      return
    }

    const polls = await knexConnection('poll')
      .select('*')
      .whereIn('uid', indexTasksUIDs)

    const pollIndexData = polls.map(poll => PollUtility.toPollIndex(poll))
    await this.elastic.bulk('poll', pollIndexData)
  }

  public async delete(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void> {
    const deleteTasksUIDs = tasks
      .filter(task => task.action === Action.DELETE)
      .map(task => task.referenceUID)

    if (!deleteTasksUIDs.length) {
      return
    }

    await this.elastic.deleteMany(deleteTasksUIDs, 'poll')
  }
}
