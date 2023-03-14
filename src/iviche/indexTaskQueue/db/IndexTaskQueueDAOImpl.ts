import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { logger } from '../../logger/LoggerFactory'
import { IndexTask } from '../model/IndexTask'
import { IndexTaskQueueDAO } from './IndexTaskQueueDAO'

export class IndexTaskQueueDAOImpl implements IndexTaskQueueDAO {
  public async create(trxProvider: TrxProvider, indexTask: IndexTask): Promise<string> {
    logger.debug('index-task-queue.dao.save.start')
    const uid = uuidv4()
    const trx = await trxProvider()

    await trx('index_task').insert({
      ...indexTask,
      uid,
      createdAt: DateUtility.now(),
    })

    logger.debug('index-task-queue.dao.save.done')
    return uid
  }

  public async createMany(
    trxProvider: TrxProvider,
    indexTasks: Array<IndexTask>,
  ): Promise<Array<string>> {
    const trx = await trxProvider()
    const insertData = indexTasks.map(task => ({
      ...task,
      uid: uuidv4(),
      createdAt: DateUtility.now(),
    }))

    await trx('index_task').insert(insertData)
    const UIDs = insertData.map(el => el.uid)
    return UIDs
  }
}
