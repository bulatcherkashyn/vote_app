import { TrxProvider } from '../../db/TrxProvider'
import { IndexTask } from '../model/IndexTask'

export interface IndexTaskQueueDAO {
  create(trxProvider: TrxProvider, indexTask: IndexTask): Promise<string>

  createMany(trxProvider: TrxProvider, indexTasks: Array<IndexTask>): Promise<Array<string>>
}
