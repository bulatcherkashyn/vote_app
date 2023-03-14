import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { Elastic, ElasticSearchHits } from '../../../../src/iviche/elastic/Elastic'
import { deleteOldNotifications } from '../../../../src/iviche/jobs/functions/deleteOldNotifications'
import { Notification } from '../../../../src/iviche/notificationStorage/models/Notification'
import { TestContext } from '../../context/TestContext'
import User = Express.User

import { EntityNames } from '../../../../src/iviche/elastic/EntityNames'
import { sleep } from '../../../unit/utility/sleep'
import { notifications } from './helper/NotificationList'

async function getTestNotifications(
  elastic: Elastic,
  userIds: Array<string>,
): Promise<ElasticSearchHits<Notification>> {
  return elastic.search<Notification>('notification', {
    terms: {
      targetUserUid: userIds,
    },
  })
}

describe('DeleteOldNotifications job', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  beforeEach(async done => {
    const elastic = container.resolve<Elastic>('Elastic')
    await elastic.clearAll()
    await elastic.bulk<Notification>(EntityNames.notification, notifications)
    done()
  })

  test('deleteOldNotifications.job should delete 1 record', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const elastic = container.resolve<Elastic>('Elastic')
    // GIVEN 13 users with 4 notifications for 2 of them
    const rawResults = await knex<User>('users').select(['uid'])
    const userIds = rawResults.map(obj => obj.uid && obj.uid.split('-', 5).join('_'))
    // Let's assume, that we want to keep first 3 notifications, and delete others
    const oldNotifications = await getTestNotifications(elastic, userIds)
    expect(oldNotifications.hits.length).toBe(4)
    expect(oldNotifications.hits[oldNotifications.hits.length - 1]._source.createdAt).toBe(
      notifications[notifications.length - 1].createdAt?.toISOString(),
    )
    // WHEN exec deleteOldNotificationsJob
    await deleteOldNotifications(knex, elastic, 3)
    await sleep(1000)
    const notificationsAfterClean = await getTestNotifications(elastic, userIds)
    // THEN 1 old notification should be deleted
    expect(notificationsAfterClean.hits.length).toBe(3)
    expect(
      notificationsAfterClean.hits[notificationsAfterClean.hits.length - 1]._source.createdAt,
    ).toBe(notifications[notifications.length - 2].createdAt?.toISOString())
  })

  test('deleteOldNotifications.job should not delete records', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const elastic = container.resolve<Elastic>('Elastic')
    // GIVEN 13 users with 4 notifications for 2 of them
    const rawResults = await knex<User>('users').select(['uid'])
    const userIds = rawResults.map(obj => obj.uid && obj.uid.split('-', 5).join('_'))
    // Let's assume, that we want to keep first 5 notifications
    const oldNotifications = await getTestNotifications(elastic, userIds)
    expect(oldNotifications.hits.length).toBe(4)
    // WHEN exec deleteOldNotificationsJob
    await deleteOldNotifications(knex, elastic, 5)
    await sleep(5000)
    const notificationsAfterClean = await getTestNotifications(elastic, userIds)
    // THEN 0 notification should be deleted
    expect(notificationsAfterClean.hits.length).toBe(4)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
