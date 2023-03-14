import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { Language } from '../../../../src/iviche/common/Language'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { IndexTaskQueueService } from '../../../../src/iviche/indexTaskQueue/service/IndexTaskQueueService'
import { ImageStorageDaoImpl } from '../../../../src/iviche/media/image/db/ImageStorageDaoImpl'
import { ImageStorageImpl } from '../../../../src/iviche/media/image/service/ImageStorageImpl'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { NewsDAOImpl } from '../../../../src/iviche/news/db/NewsDAOImpl'
import { NewsDBTuple } from '../../../../src/iviche/news/dto/NewsDBTuple'
import { News } from '../../../../src/iviche/news/model/News'
import { NewsSection } from '../../../../src/iviche/news/model/NewsSection'
import { NewsStatus } from '../../../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../../../src/iviche/news/model/NewsTheme'
import { WPNews } from '../../../../src/iviche/news/model/WPNews'
import { NewsService } from '../../../../src/iviche/news/services/NewsService'
import { NewsServiceImpl } from '../../../../src/iviche/news/services/NewsServiceImpl'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDetailsDAOImpl } from '../../../../src/iviche/users/db/UserDetailsDAOImpl'
import { personsList } from '../../../database/seeds/01_InitialData'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { newsDBTupleList, newsDBTupleListWithAuthorData, newsObjList } from './NewsTestHelper'

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

describe('News service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create News', async () => {
    // GIVEN News data from WP to be saved
    const wpNews: WPNews = {
      idPost: 11,
      alternativeLink: 'http://iveche.1gb.ua/?p=11',
      authorUID: 1,
      postDate: DateUtility.now().toISOString(),
      postModified: DateUtility.now().toISOString(),
      newsSection: NewsSection.ANALYTICS,
      theme: NewsTheme.ECONOMY,
      tags: ['Иран', 'катастрофа', 'РНБО', 'Украина', 'Україна'],
      status: NewsStatus.DRAFT,
      newsBodyList: [
        {
          title: 'Тест UA',
          body: '<p>wwadawfwaf</p>\n',
          seoTitle: 'Запис тест',
          seoDescription: 'afwafawf',
          shortDescription: 'wwadawfwaf',
          language: Language.UA,
        },
        {
          title: 'Тест RU',
          body: '<p>awfwaf</p>\n',
          seoTitle: 'Запис тест рус',
          seoDescription: 'afawfawf',
          shortDescription: 'awfwaf',
          language: Language.RU,
        },
        {
          title: 'Test EN',
          body: '<p>awfwaf</p>\n',
          seoTitle: 'test',
          seoDescription: 'test',
          shortDescription: 'test',
          language: Language.EN,
        },
      ],
    }

    // AND expected save queries
    knexTracker.mockSQL(
      [
        oneLine`
        select "uid" from "user_details"
          where "wpJournalistID" = $1 limit $2`,
        oneLine`
        insert into "news" ("alternativeLink", "authorUID", "createdAt", "headerImage", "lastSyncAt", "pollUID",
          "publishedAt", "section", "status", "tags", "theme", "uid", "wpID")
        values ($1, $2, $3, DEFAULT, $4, DEFAULT, $5, $6, $7, $8, $9, $10, $11)`,
        oneLine`
        insert into "news_body" ("body", "language", "newsUID", "seoDescription", "seoTitle",
          "shortDescription", "title", "uid")
        values ($1, $2, $3, $4, $5, $6, $7, $8), ($9, $10, $11, $12, $13, $14, $15, $16),
          ($17, $18, $19, $20, $21, $22, $23, $24)`,
      ],
      [
        { uid: '00000000-aaaa-aaaa-aaaa-000000000001' },
        '00000000-aaaa-aaaa-aaaa-000000000001',
        '00000000-aaaa-aaaa-aaaa-000000000002',
      ],
    )

    // WHEN News is saved
    const uid = await newsService.save(wpNews)
    // THEN we expect that tracker works fine and uid has been returned
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('delete News', async () => {
    // GIVEN News uid to be deleted
    const newsUID = newsDBTupleList[0].uid as string
    // AND expected delete query
    knexTracker.mockSQL(
      ['delete from "news_body" where "newsUID" = $1', 'delete from "news" where "uid" = $1'],
      [3, 1],
    )

    // WHEN News is deleted
    await newsService.delete(newsUID)

    // THEN no errors occur
  })

  test('load News by uid', async () => {
    // GIVEN News uid to be loaded
    const newsUID = newsDBTupleListWithAuthorData[0].uid as string
    // AND expected News-NewsBody data
    const intermediateTuples = [
      newsDBTupleListWithAuthorData[0],
      newsDBTupleListWithAuthorData[1],
      newsDBTupleListWithAuthorData[2],
    ]
    const authorData = personsList[0]
    const { isLegalPerson, firstName, lastName } = authorData
    const expectedNewsObject = {
      ...newsObjList[0],
      authorData: { isLegalPerson, firstName, lastName, shortName: null, avatar: null, bio: null },
    }

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
      [intermediateTuples],
    )

    // WHEN News is loaded
    const data = await newsService.getBy('uid', newsUID)

    // THEN loaded data should be equal to the expected News object
    expect(data).toEqual(expectedNewsObject)
  })

  test('load page News list', async () => {
    // GIVEN expected News list be loaded
    const intermediateNewsTuples: Array<NewsDBTuple> = newsDBTupleList
    const expectedNews: Array<News> = newsObjList

    // AND expected load query method
    knexTracker.mockSQL(
      [
        'select count("uid") from "news" limit $1',
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
            "news"."authorUID" as "authorUID",
            "news"."wpID" as "wpID",
            "news"."pollUID" as "pollUID",
            "news"."commentsCount" as "commentsCount",
            "news_body"."uid" as "bodyUid",
            "news_body"."language" as "language",
            "news_body"."seoTitle" as "seoTitle",
            "news_body"."seoDescription" as "seoDescription",
            "news_body"."title" as "title",
            "news_body"."shortDescription" as "shortDescription",
            "news_body"."newsUID" as "newsUID",
            "news_body"."body" as "body"
        from
            "news"
            inner join "news_body" on "news"."uid" = "news_body"."newsUID"
        where "news"."uid" in (select "uid" from "news" limit $1 offset $2)`,
      ],
      [{ count: 4 }, intermediateNewsTuples],
    )

    const expectedPagedList = {
      list: List(expectedNews),
      metadata: {
        limit: 2,
        offset: 2,
        total: 4,
      },
    }

    // WHEN news list is loaded
    const loadedList = await newsService.list({ limit: 2, offset: 2 }, new GrandAccessACS())
    // THEN we expect that the original list
    expect(loadedList).toEqual(expectedPagedList)
  })

  test('test getAnalyticalNews', async () => {
    const newsTupleColumns = `"news"."uid" as "uid",
        "news"."alternativeLink" as "alternativeLink",
        "news"."section" as "section",
        "news"."theme" as "theme",
        "news"."headerImage" as "headerImage",
        "news"."status" as "status",
        "news"."createdAt" as "createdAt",
        "news"."publishedAt" as "publishedAt",
        "news"."lastSyncAt" as "lastSyncAt",
        "news"."tags" as "tags",
        "news"."authorUID" as "authorUID",
        "news"."wpID" as "wpID",
        "news"."pollUID" as "pollUID",
        "news_body"."uid" as "bodyUid",
        "news_body"."language" as "language",
        "news_body"."seoTitle" as "seoTitle",
        "news_body"."seoDescription" as "seoDescription",
        "news_body"."title" as "title",
        "news_body"."shortDescription" as "shortDescription",
        "news_body"."newsUID" as "newsUID",
        "news_body"."body" as "body"`
    knexTracker.mockSQL(
      [
        oneLine`
          select ${newsTupleColumns}
        from
            "news" inner join "news_body" on "news"."uid" = "news_body"."newsUID"
            where "pollUID" is not null
            order by "publishedAt" desc limit $1`,
      ],
      [[]],
    )

    const loadedNews = await newsService.getAnalyticalNews(2)
    expect(loadedNews.length).toBe(0)
  })

  test('test getGroupedThemeNews', async () => {
    const emptyThemedNews = {
      CULTURAL_SPACE: [],
      ECONOMY: [],
      POLITICAL_MAP: [],
      PUBLIC_INTEREST: [],
      SCIENCE_AND_EDUCATION: [],
    }
    knexTracker.mockSQL(
      [
        oneLine`
          select *
          from (select news.uid, row_number()
            over(partition by theme order by "publishedAt" desc) as row_num
            from news
            where theme IN ('POLITICAL_MAP', 'ECONOMY', 'PUBLIC_INTEREST', 'SCIENCE_AND_EDUCATION', 'CULTURAL_SPACE')
          ) as T
          where T.row_num <= 4`,
      ],
      [[]],
    )

    const loadedNews = await newsService.getGroupedThemeNews(4)
    expect(loadedNews).toEqual(emptyThemedNews)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
