import { Action, IndexTask } from '../../indexTaskQueue/model/IndexTask'
import Knex = require('knex')
import { Elastic } from '../../elastic/Elastic'

type ActionsFields = {
  [key in Action]: (knexConnection: Knex, tasks: Array<IndexTask>) => Promise<void>
}
export abstract class IndexDataExtractor implements ActionsFields {
  protected elastic = new Elastic()

  abstract index(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void>

  abstract delete(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void>

  public async exec(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void> {
    for (const action of Object.values(Action)) {
      await this[action](knexConnection, tasks)
    }
  }
}
