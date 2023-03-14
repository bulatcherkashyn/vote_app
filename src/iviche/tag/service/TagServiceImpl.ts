import Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TagUtility } from '../../common/utils/TagUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { logger } from '../../logger/LoggerFactory'
import { TagDAO } from '../db/TagDAO'
import { Tag } from '../model/Tag'
import { TagService } from './TagService'

@injectable()
export class TagServiceImpl implements TagService {
  constructor(@inject('TagDAO') private dao: TagDAO, @inject('DBConnection') private db: Knex) {}

  public async update(entity: Tag): Promise<void> {
    logger.debug('tag.service.update.start')

    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.update(trxProvider, entity)
      logger.debug('tag.service.update.done')
    })
  }

  public save(entity: Tag): Promise<string | undefined> {
    logger.debug('tag.service.update.start')

    return TrxUtility.transactional<string | undefined>(this.db, async trxProvider => {
      const result = await this.dao.saveMultiple(trxProvider, [entity.value])
      logger.debug('tag.service.save.done')
      return result ? result[0].uid : undefined
    })
  }

  public async saveMultiple(
    trxProvider: TrxProvider,
    tagValues: Array<string>,
  ): Promise<Array<Tag>> {
    logger.debug('tag.service.save-multiple.start')
    if (!tagValues.length) {
      return []
    }
    TagUtility.validateTagValues(tagValues)
    const tags = await this.dao.saveMultiple(trxProvider, tagValues)
    logger.debug('tag.service.save-multiple.done')
    return tags
  }

  public async delete(uid: string): Promise<void> {
    logger.debug('tag.service.delete.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.delete(trxProvider, uid)
      logger.debug('tag.service.delete.done')
    })
  }

  public async list(): Promise<Array<Tag>> {
    logger.debug('tag.service.list.start')
    return TrxUtility.transactional<Array<Tag>>(this.db, async trxProvider => {
      const tags = await this.dao.list(trxProvider)

      logger.debug('tag.service.list.done')
      return tags
    })
  }
}
