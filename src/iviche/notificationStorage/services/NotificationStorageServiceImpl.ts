import * as esb from 'elastic-builder'
import { inject, injectable } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import { DateUtility } from '../../common/utils/DateUtility'
import { NotificationStorageUtility } from '../../common/utils/NotificationStorageUtility'
import { Elastic } from '../../elastic/Elastic'
import { EntityNames } from '../../elastic/EntityNames'
import { logger } from '../../logger/LoggerFactory'
import { Notification } from '../models/Notification'
import { NotificationType } from '../models/NotificationType'
import { NotificationStorageService } from './NotificationStorageService'

@injectable()
export class NotificationStorageServiceImpl implements NotificationStorageService {
  constructor(@inject('Elastic') private elastic: Elastic) {}

  public async save(notification: Notification): Promise<string> {
    logger.debug('notification-storage.service.save-message.start')
    const uid = notification.uid || uuidv4()

    const dataForElastic: Notification = {
      // NOTE The elastic indexing does not work with "-", so we change it to "_"
      ...NotificationStorageUtility.formatToElastic({ ...notification, uid }),
      createdAt: notification.createdAt || DateUtility.now(),
      isRead: notification.isRead || false,
    }
    await this.elastic.index(uid, EntityNames.notification, dataForElastic)
    logger.debug('notification-storage.service.save-message.done')
    return uid
  }

  public async saveMany(notifications: Array<Notification>): Promise<void> {
    logger.debug('notification-storage.service.save-many-message.start')
    const dataForElastic = notifications.map(notification => {
      const uid = notification.uid || uuidv4()

      return {
        // NOTE The elastic indexing does not work with "-", so we change it to "_"
        ...NotificationStorageUtility.formatToElastic({ ...notification, uid }),
        createdAt: notification.createdAt || DateUtility.now(),
        isRead: notification.isRead || false,
      }
    })

    await this.elastic.bulk<Notification>(EntityNames.notification, dataForElastic)
    logger.debug('notification-storage.service.save-many-message.done')
  }

  public async search(
    targetUserUID: string,
    size = 100,
    notificationTypes?: Array<NotificationType>,
  ): Promise<Array<Notification>> {
    logger.debug('notification-storage.service.search.start')
    const builder = esb.boolQuery()

    builder.must(esb.termQuery('targetUserUid', targetUserUID.split('-', 5).join('_')))

    if (notificationTypes) {
      const typeQuery = notificationTypes.map(type => esb.termQuery('type', type.toLowerCase()))
      builder.must(esb.boolQuery().should(typeQuery))
    }

    const sortBy = esb.sort('createdAt', 'desc')

    const elasticData = await this.elastic.search<Notification>(
      EntityNames.notification,
      builder.toJSON(),
      size,
      sortBy.toJSON(),
    )

    const rawResult = elasticData.hits.map(el => el._source)
    const result = NotificationStorageUtility.formatFromElastic(rawResult)
    logger.debug('notification-storage.service.search.done')
    return result
  }

  public async markAsRead(userUID: string, UIDs?: Array<string>): Promise<void> {
    logger.debug('notification-storage.service.change-read-status.start')

    if (UIDs && !UIDs.length) {
      logger.debug('notification-storage.service.change-read-status.done.empty-uids')
      return
    }

    // NOTE This script is responsible for changing the 'read' field
    // IMPORTANT! Need use only params for transfer parameters and their values to the script
    const script = esb
      .script('source', 'ctx._source["isRead"] = params.status')
      .params({ status: true })

    const builder = esb.boolQuery()
    builder.must(esb.termQuery('targetUserUid', userUID.split('-', 5).join('_')))

    if (UIDs && UIDs.length) {
      const uidQuery = UIDs.map(uid =>
        esb.boolQuery().must(esb.matchQuery('uid', uid.split('-').join('_'))),
      )
      builder.must(esb.boolQuery().should(uidQuery))
    }

    await this.elastic.updateByQuery(EntityNames.notification, script.toJSON(), builder.toJSON())
    logger.debug('notification-storage.service.change-read-status.done')
  }

  public async countUnread(targetUserUID: string): Promise<number> {
    logger.debug('notification-storage.service.count.start')
    const builder = esb.boolQuery()

    builder.must(esb.termQuery('targetUserUid', targetUserUID.split('-', 5).join('_')))
    builder.must(esb.termQuery('isRead', 'false'))

    const count = await this.elastic.count(EntityNames.notification, builder.toJSON())
    logger.debug('notification-storage.service.count.done')
    return count
  }
}
