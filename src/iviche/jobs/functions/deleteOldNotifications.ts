import Knex from 'knex'

import { EnvironmentMode } from '../../common/EnvironmentMode'
import { Elastic } from '../../elastic/Elastic'
import { EntityNames } from '../../elastic/EntityNames'
import { logger } from '../../logger/LoggerFactory'
import { User } from '../../users/models/User'

const PROCESS_EXIT_ERROR = -322

export const deleteOldNotifications = async (
  knex: Knex,
  elastic: Elastic,
  offset = 1000,
): Promise<void> => {
  try {
    const rawResults = await knex<User>('users').select(['uid'])
    const userIds = rawResults.map(obj => obj.uid && obj.uid.split('-', 5).join('_'))
    logger.debug(`old-notifications-cleaner.job.userIds:[${userIds}]`)
    for (const id of userIds) {
      const results = await elastic.search<Array<Notification>>(
        'notification',
        {
          match: {
            targetUserUid: id,
          },
        },
        0,
        {
          createdAt: {
            order: 'desc',
          },
        },
        offset,
      )
      if (results.hits.length > 0) {
        logger.debug(`old-notifications-cleaner.job.notifications:[${results.hits}]`)
        const notificationIds = results.hits.map(notification => notification._id)
        await elastic.deleteMany(notificationIds, EntityNames.notification)
      }
    }
  } catch (e) {
    await knex.destroy()
    logger.error(`old-notifications-cleaner.job.error:`, e)
    if (!EnvironmentMode.isTest()) {
      process.exit(PROCESS_EXIT_ERROR)
    }
  }
}
