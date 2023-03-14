import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { DateUtility } from '../../../common/utils/DateUtility'
import { checkDAOResult } from '../../../generic/dao/ErrorsDAO'
import { logger } from '../../../logger/LoggerFactory'
import { Image } from '../model/Image'
import { ImageStorageDao } from './ImageStorageDao'

@injectable()
export class ImageStorageDaoImpl implements ImageStorageDao {
  constructor(@inject('DBConnection') private knex: Knex) {}

  async save(image: Image): Promise<void> {
    logger.debug('image.storage.dao.save.start')
    await this.knex('image').insert({
      ...image,
      createdAt: DateUtility.now(),
    })
    logger.debug('image.storage.dao.save.done')
  }

  async delete(uid: string): Promise<void> {
    logger.debug('image.storage.dao.delete.start')
    await this.knex('image')
      .where({ uid: uid })
      .delete()
    logger.debug('image.storage.dao.delete.done')
  }

  async update(image: Image): Promise<void> {
    logger.debug('image.storage.dao.update.start')
    const result = await this.knex('image')
      .where({ uid: image.uid })
      .update({
        entity: image.entity,
        originalName: image.originalName,
        isPublic: image.isPublic,
        data: image.data,
        mimeType: image.mimeType,
        ownerUID: image.ownerUID,
      })

    checkDAOResult(result, 'image', 'update')
    logger.debug('image.storage.dao.update.done')
  }

  async get(uid: string, ownerUID?: string): Promise<Image> {
    logger.debug('image.storage.dao.get.start')
    const where = ownerUID ? { ownerUID } : {}
    const image = await this.knex
      .select('*')
      .from('image')
      .where({ uid })
      .andWhere(function() {
        this.where({ isPublic: true })
        this.orWhere(where)
      })
      .first()
    logger.debug('image.storage.dao.get.done')
    return image
  }
}
