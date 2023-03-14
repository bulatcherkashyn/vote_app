import 'reflect-metadata'

import * as Knex from 'knex'

import { CommentDAOImpl } from '../../comment/db/CommentDAOImpl'
import { CommentEntity } from '../../comment/model/CommentEntity'
import { CommentService } from '../../comment/service/CommentService'
import { CommentServiceImpl } from '../../comment/service/CommentServiceImpl'
import { Elastic } from '../../elastic/Elastic'
import { IndexTaskQueueDAOImpl } from '../../indexTaskQueue/db/IndexTaskQueueDAOImpl'
import { IndexTaskQueueServiceImpl } from '../../indexTaskQueue/service/IndexTaskQueueServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { ImageStorageDaoImpl } from '../../media/image/db/ImageStorageDaoImpl'
import { ImageStorageImpl } from '../../media/image/service/ImageStorageImpl'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { NewsDAOImpl } from '../../news/db/NewsDAOImpl'
import { NewsStatus } from '../../news/model/NewsStatus'
import { NewsService } from '../../news/services/NewsService'
import { NewsServiceImpl } from '../../news/services/NewsServiceImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { GrandAccessACS } from '../../security/acs/strategies'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'
import { UserDetailsDAOImpl } from '../../users/db/UserDetailsDAOImpl'

function getNewsService(knexConnection: Knex): NewsService {
  return new NewsServiceImpl(
    new NewsDAOImpl(),
    knexConnection,
    new IndexTaskQueueServiceImpl(new IndexTaskQueueDAOImpl()),
    new UserDetailsDAOImpl(),
    new ImageStorageImpl(new ImageStorageDaoImpl(knexConnection)),
    new PollServiceImpl(
      new PollDAOImpl(),
      knexConnection,
      new Elastic(),
      new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
      new PersonDAOImpl(),
    ),
    new Elastic(),
  )
}

function getCommentService(knexConnection: Knex): CommentService {
  return new CommentServiceImpl(new CommentDAOImpl(), knexConnection)
}

async function updateCommentCountForNews(knexConnection: Knex, newsUID: string): Promise<void> {
  const commentsService = getCommentService(knexConnection)
  const newsService = getNewsService(knexConnection)
  const commentsCount = await commentsService.countComments(newsUID, CommentEntity.NEWS)
  await newsService.updateCommentsCount(newsUID, commentsCount, new GrandAccessACS())
}

export const newsCommentCount = async (knexConnection: Knex): Promise<void> => {
  try {
    const newsService = getNewsService(knexConnection)
    const news = await newsService.getNewsByStatuses([NewsStatus.PUBLISHED])
    const promises = news.map(newsItem => updateCommentCountForNews(knexConnection, newsItem.uid))
    await Promise.all(promises)
  } catch (error) {
    knexConnection.destroy()
    logger.error(`news-comment-count.job.error:`, error)
  }
  knexConnection.destroy()
}
