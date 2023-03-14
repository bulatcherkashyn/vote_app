import { TrxProvider } from '../../db/TrxProvider'
import { IndexTask } from '../model/IndexTask'

export interface IndexTaskQueueService {
  save(trxProvider: TrxProvider, indexTask: IndexTask): Promise<string>
}
