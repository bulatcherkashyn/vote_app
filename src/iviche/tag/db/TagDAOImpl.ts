import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { logger } from '../../logger/LoggerFactory'
import { Tag } from '../model/Tag'
import { TagDAO } from './TagDAO'

export class TagDAOImpl implements TagDAO {
  public async update(trxProvider: TrxProvider, tag: Tag): Promise<string | undefined> {
    logger.debug('tag.dao.update.start')
    const trx = await trxProvider()
    const result = await trx('tag')
      .where({ uid: tag.uid })
      .update({
        value: tag.value,
        lastUseAt: DateUtility.now(),
      })

    checkDAOResult(result, 'tag', 'update')
    logger.debug('tag.dao.update.done')
    return tag.uid
  }

  public async saveMultiple(
    trxProvider: TrxProvider,
    tagValues: Array<string>,
  ): Promise<Array<Tag>> {
    logger.debug('tag.dao.save-multiple.start')

    const values = new Array(tagValues.length).fill('(?, ?, ?, ?)').join(', ')
    const tags = this.createTagsEntities(tagValues)

    const trx = await trxProvider()
    const result = await trx.raw(
      `insert into tag ("uid", "value", "lastUseAt", "createdAt") values ${values} ON CONFLICT (value) DO update set "lastUseAt" = NOW() returning *`,
      tags,
    )

    logger.debug('tag.dao.save-multiple.done')
    return result.rows
  }

  public async list(trxProvider: TrxProvider, limit = 1000): Promise<Array<Tag>> {
    logger.debug('tag.dao.list.start')

    const trx = await trxProvider()
    const result = await trx<Tag>('tag')
      .orderBy('lastUseAt', 'desc')
      .limit(limit)

    logger.debug('tag.dao.list.done')
    return result
  }

  public async delete(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('tag.dao.delete.start')
    const trx = await trxProvider()

    const result = await trx('tag')
      .where({ uid: uid })
      .delete()

    checkDAOResult(result, 'tag', 'delete')
    logger.debug('tag.dao.delete.done')
  }

  // NOTE: Construct array for inserting in DB which should looks like [...tag1, ...tag2, and so on]
  private createTagsEntities(tagValues: Array<string>): Array<string | Date> {
    const now = DateUtility.now()

    return tagValues.reduce((acc: Array<string | Date>, tagValue) => {
      const uid = uuidv4()
      const arr = [uid, tagValue, now, now]
      return [...acc, ...arr]
    }, [])
  }
}
