import 'reflect-metadata'

import axios, { AxiosResponse } from 'axios'
import * as Knex from 'knex'

import { EnvironmentMode } from '../../common/EnvironmentMode'
import { DateUtility } from '../../common/utils/DateUtility'
import { Elastic } from '../../elastic/Elastic'
import { IndexTaskQueueDAOImpl } from '../../indexTaskQueue/db/IndexTaskQueueDAOImpl'
import { IndexTaskQueueServiceImpl } from '../../indexTaskQueue/service/IndexTaskQueueServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { ImageStorageDaoImpl } from '../../media/image/db/ImageStorageDaoImpl'
import { ImageStorageImpl } from '../../media/image/service/ImageStorageImpl'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { NewsDAOImpl } from '../../news/db/NewsDAOImpl'
import { NewsStatus } from '../../news/model/NewsStatus'
import { WPNews } from '../../news/model/WPNews'
import { NewsServiceImpl } from '../../news/services/NewsServiceImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'
import { UserDetailsDAOImpl } from '../../users/db/UserDetailsDAOImpl'

async function getNewsDataFromWP(): Promise<Array<WPNews>> {
  const request: AxiosResponse = await axios.get(NewsServiceImpl.WP_LAST_NEWS_URL)
  return request.data as Array<WPNews>
}

interface NewsWpSync {
  uid: string
  wpID: number
  lastSyncAt: Date
}

async function getNewsCheckListByPostIds(
  knexConnection: Knex,
  postIds: Array<number>,
): Promise<Array<NewsWpSync> | void> {
  return knexConnection<NewsWpSync | undefined>('news')
    .select('news.uid as uid', 'news.wpID as wpID', 'news.lastSyncAt as lastSyncAt')
    .whereIn('wpID', postIds)
}

async function extractNewsFromWp(
  knexConnection: Knex,
  newsCheckList: Array<NewsWpSync>,
  wpNewsList: Array<WPNews>,
): Promise<void> {
  const pollService = new PollServiceImpl(
    new PollDAOImpl(),
    knexConnection,
    new Elastic(),
    new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
    new PersonDAOImpl(),
  )
  const indexTaskQueue = new IndexTaskQueueServiceImpl(new IndexTaskQueueDAOImpl())
  const newsService = new NewsServiceImpl(
    new NewsDAOImpl(),
    knexConnection,
    indexTaskQueue,
    new UserDetailsDAOImpl(),
    new ImageStorageImpl(new ImageStorageDaoImpl(knexConnection)),
    pollService,
    new Elastic(),
  )

  for (const wpNews of wpNewsList) {
    const existingNews = newsCheckList.find(newsSyncInfo => {
      return newsSyncInfo.wpID === wpNews.idPost
    })
    if (!existingNews && wpNews.status !== NewsStatus.DELETED) {
      try {
        await newsService.save(wpNews)
      } catch (error) {
        logger.error('save-news-from-wp.job.create.error:', error)
        continue
      }
    }
    if (existingNews && wpNews.status === NewsStatus.DELETED) {
      try {
        await newsService.delete(existingNews.uid)
      } catch (error) {
        logger.error('save-news-from-wp.job.delete.error:', error)
        continue
      }
    }

    if (
      existingNews &&
      existingNews.lastSyncAt.toISOString() !==
        DateUtility.fromISO(wpNews.postModified).toISOString()
    ) {
      const wpNewsForUpdate = { ...wpNews, uid: existingNews.uid }
      try {
        await newsService.save(wpNewsForUpdate)
      } catch (error) {
        logger.error('save-news-from-wp.job.update.error:', error)
        continue
      }
    }
  }
}

export const saveNewsFromWp = async (dbConnection: Knex): Promise<void> => {
  const PROCESS_EXIT_ERROR = -322
  try {
    const wpNewsList = await getNewsDataFromWP()

    if (!wpNewsList) {
      await dbConnection.destroy()
      return
    }

    const postIds = wpNewsList.map(wpNews => wpNews.idPost)

    const newsCheckList = (await getNewsCheckListByPostIds(dbConnection, postIds)) || []

    await extractNewsFromWp(dbConnection, newsCheckList, wpNewsList)
  } catch (error) {
    await dbConnection.destroy()
    logger.error('save-news-from-wp.job.error:', error)
    if (!EnvironmentMode.isTest()) {
      process.exit(PROCESS_EXIT_ERROR)
    }
  }
  await dbConnection.destroy()
}
