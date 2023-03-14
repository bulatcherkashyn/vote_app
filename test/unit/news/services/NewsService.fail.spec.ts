import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { IndexTaskQueueService } from '../../../../src/iviche/indexTaskQueue/service/IndexTaskQueueService'
import { ImageStorageDaoImpl } from '../../../../src/iviche/media/image/db/ImageStorageDaoImpl'
import { ImageStorageImpl } from '../../../../src/iviche/media/image/service/ImageStorageImpl'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { NewsDAOImpl } from '../../../../src/iviche/news/db/NewsDAOImpl'
import { NewsService } from '../../../../src/iviche/news/services/NewsService'
import { NewsServiceImpl } from '../../../../src/iviche/news/services/NewsServiceImpl'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDetailsDAOImpl } from '../../../../src/iviche/users/db/UserDetailsDAOImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { newsDBTupleList } from './NewsTestHelper'

const indexTaskQueueServiceMock: jest.Mock<IndexTaskQueueService> = jest
  .fn()
  .mockImplementation(() => {
    return {
      save: jest.fn(),
    }
  })

const MockTelegramBotService: jest.Mock<TelegramBotServiceImpl> = jest
  .fn()
  .mockImplementation(() => {
    return {
      notifyModerators: jest.fn(),
    }
  })

const knexTracker = new KnexTestTracker()
const pollService = new PollServiceImpl(
  new PollDAOImpl(),
  knexTracker.getTestConnection(),
  new Elastic(),
  new ModerationDAOImpl(new PollDAOImpl(), MockTelegramBotService()),
  new PersonDAOImpl(),
)
const newsService: NewsService = new NewsServiceImpl(
  new NewsDAOImpl(),
  knexTracker.getTestConnection(),
  new indexTaskQueueServiceMock(),
  new UserDetailsDAOImpl(),
  new ImageStorageImpl(new ImageStorageDaoImpl(knexTracker.getTestConnection())),
  pollService,
  new Elastic(),
)
describe('Fail news service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('delete News, rows don`t found', async () => {
    // GIVEN News uid to be deleted
    const newsUID = newsDBTupleList[0].uid as string
    // AND expected delete query
    knexTracker.mockSQL(
      ['delete from "news_body" where "newsUID" = $1', 'delete from "news" where "uid" = $1'],
      [3, 0],
      false,
    )

    try {
      // WHEN News is deleted
      await newsService.delete(newsUID)
    } catch (e) {
      // THEN got error
      expect(e.message).toBe('Not found [news] entity for delete')
    }
  })

  test('delete News fail, count delete to much', async () => {
    // GIVEN News uid to be deleted
    const newsUID = newsDBTupleList[0].uid as string
    // AND expected delete query
    knexTracker.mockSQL(
      ['delete from "news_body" where "newsUID" = $1', 'delete from "news" where "uid" = $1'],
      [3, 2],
      false,
    )

    try {
      // WHEN News is deleted
      await newsService.delete(newsUID)
    } catch (e) {
      // THEN got error
      expect(e.message).toBe('delete for entity [news] failed')
    }
  })

  test('load News, return many News data', async () => {
    // GIVEN News uid to be loaded
    const newsUID = newsDBTupleList[0].uid as string
    // AND News tuple list many news
    // AND expected load query method
    knexTracker.mockSQL(
      [
        oneLine`
        select
            "news"."uid" as "uid",
            "news"."alternativeLink" as "alternativeLink",
            "news"."section" as "section",
            "news"."theme" as "theme",
            "news"."headerImage" as "headerImage",
            "news"."status" as "status",
            "news"."createdAt" as "createdAt",
            "news"."publishedAt" as "publishedAt",
            "news"."lastSyncAt" as "lastSyncAt",
            "news"."tags" as "tags",
            "news"."wpID" as "wpID",
            "news"."authorUID" as "authorUID",
            "news"."pollUID" as "pollUID",
            "news"."commentsCount" as "commentsCount",
            "news_body"."uid" as "bodyUid",
            "news_body"."language" as "language",
            "news_body"."seoTitle" as "seoTitle",
            "news_body"."seoDescription" as "seoDescription",
            "news_body"."title" as "title",
            "news_body"."shortDescription" as "shortDescription",
            "news_body"."newsUID" as "newsUID",
            "news_body"."body" as "body",
            "authorPerson"."isLegalPerson" as "authorIsLegalPerson",
            "authorPerson"."firstName" as "authorFirstName",
            "authorPerson"."lastName" as "authorLastName",
            "authorPerson"."shortName" as "authorShortName",
            "authorPerson"."avatar" as "authorAvatar",
            "authorPerson"."email" as "authorEmail",
            "authorPerson"."bio" as "authorBio"
        from
            "news"
            inner join "news_body" on "news"."uid" = "news_body"."newsUID"
            inner join "users" as "authorUser" on "news"."authorUID" = "authorUser"."uid"
            inner join "person" as "authorPerson" on "authorUser"."personUID" = "authorPerson"."uid"
        where "news"."uid" = $1`,
      ],
      [newsDBTupleList],
      false,
    )

    try {
      // WHEN News is loaded
      await newsService.getBy('uid', newsUID)
    } catch (e) {
      // THEN got error in convert to simple news
      expect(e.message).toBe('Cannot get single News from loaded data')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
