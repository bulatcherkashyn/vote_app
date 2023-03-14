import { inject, injectable } from 'tsyringe'

import { TrxProvider } from '../../db/TrxProvider'
import { logger } from '../../logger/LoggerFactory'
import { IndexTaskQueueDAO } from '../db/IndexTaskQueueDAO'
import { IndexTask } from '../model/IndexTask'
import { IndexTaskQueueService } from './IndexTaskQueueService'

@injectable()
export class IndexTaskQueueServiceImpl implements IndexTaskQueueService {
  constructor(@inject('IndexTaskQueueDAO') private dao: IndexTaskQueueDAO) {}

  public async save(trxProvider: TrxProvider, indexTask: IndexTask): Promise<string> {
    logger.debug('index-task-queue.service.save.start')

    const uid = await this.dao.create(trxProvider, indexTask)
    logger.debug('index-task-queue.service.save.done')
    return uid
  }
}
