import { Promise as Promises } from 'bluebird'
import cheerio from 'cheerio'
import * as esb from 'elastic-builder'
import { List } from 'immutable'
import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { apiServerURL } from '../../../../config/serverURLConfig'
import { DateUtility } from '../../common/utils/DateUtility'
import { UIDUtility } from '../../common/utils/UIDUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { Elastic } from '../../elastic/Elastic'
import { NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { PagedList } from '../../generic/model/PagedList'
import { Action, IndexTask, ReferenceType } from '../../indexTaskQueue/model/IndexTask'
import { IndexTaskQueueService } from '../../indexTaskQueue/service/IndexTaskQueueService'
import { logger } from '../../logger/LoggerFactory'
import { ImageEntity } from '../../media/image/model/Image'
import { ImageStorage } from '../../media/image/service/ImageStorage'
import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { PollService } from '../../polls/services/PollService'
import { ACS } from '../../security/acs/models/ACS'
import { GrandAccessACS } from '../../security/acs/strategies'
import { UserDetailsDAO } from '../../users/db/UserDetailsDAO'
import { NewsDAO } from '../db/NewsDAO'
import { ThemedNews } from '../model/DashboardNews'
import { News } from '../model/News'
import { NewsBody } from '../model/NewsBody'
import { NewsIndex } from '../model/NewsIndex'
import { ElasticParams, NewsListFilter } from '../model/NewsQueryList'
import { NewsStatus } from '../model/NewsStatus'
import { WPNews } from '../model/WPNews'
import { NewsService } from './NewsService'

@injectable()
export class NewsServiceImpl implements NewsService {
  public static WP_LAST_NEWS_URL = `${process.env.WP_URL}/all-posts/?forLastDays=1`

  private BLANK_IMAGE_URL = 'http://wp.iviche.com/wp-content/uploads/2020/07/blank_image.png'

  constructor(
    @inject('NewsDAO') private dao: NewsDAO,
    @inject('DBConnection') private db: Knex,
    @inject('IndexTaskQueueService') private indexTaskQueue: IndexTaskQueueService,
    @inject('UserDetailsDAO') private userDetailsDAO: UserDetailsDAO,
    @inject('ImageStorage') private imageStorage: ImageStorage,
    @inject('PollService') private pollService: PollService,
    @inject('Elastic') private elasticClient: Elastic,
  ) {}

  private async getAuthorUIDByWpID(trxProvider: TrxProvider, wpAuthorUID: number): Promise<string> {
    const result = await this.userDetailsDAO.getWpJournalistId(trxProvider, wpAuthorUID)

    if (!result) {
      throw new ServerError('Author not found')
    }

    return result
  }

  private async getImageUrl(wpUrl?: string, authorUID?: string): Promise<string | undefined> {
    if (!wpUrl || !authorUID) {
      return
    }
    try {
      const imageUID = await this.imageStorage.saveFromUrl(wpUrl, ImageEntity.news, authorUID)

      const url = apiServerURL + '/images/' + imageUID
      return url
    } catch (e) {
      logger.debug('news.service.get-image-url.error', e)
    }
  }

  private async changeImagesInNewsBody(
    newsBodyList: Array<NewsBody>,
    authorUID: string,
  ): Promise<Array<NewsBody>> {
    const newNewsBodyArray: Array<NewsBody> = []
    for (const newsBody of newsBodyList) {
      const $ = cheerio.load(newsBody.body, {
        xmlMode: true,
        decodeEntities: true,
      })
      $('iframe')
        .filter((i, e) => !e.children.length)
        .text('')
      await Promises.each($('img').get(), async (el: CheerioElement) => {
        const imageURL = await this.getImageUrl(el.attribs.src, authorUID)
        el.attribs.src = imageURL || this.BLANK_IMAGE_URL
        // NOTE: we can implement srcset in future https://www.npmjs.com/package/srcset
        delete el.attribs.srcset
      })

      const newBody = $.html({ decodeEntities: false })
      newNewsBodyArray.push({ ...newsBody, body: newBody })
    }
    return newNewsBodyArray
  }
  // TODO: Also we need remove all old images according https://dewais.atlassian.net/browse/IV-437
  private async constructNewsFromWP(trxProvider: TrxProvider, wpNews: WPNews): Promise<News> {
    const authorUID = await this.getAuthorUIDByWpID(trxProvider, wpNews.authorUID)
    const headerImageURL = await this.getImageUrl(wpNews.headerImage, authorUID)
    const newsBodyList = await this.changeImagesInNewsBody(wpNews.newsBodyList, authorUID)
    const poll =
      wpNews.pollUID && (await this.pollService.get(wpNews.pollUID, new GrandAccessACS()))

    const news: News = {
      uid: wpNews.uid,
      wpID: wpNews.idPost,
      pollUID: (poll && wpNews.pollUID) || undefined,
      headerImage: headerImageURL,
      alternativeLink: wpNews.alternativeLink,
      authorUID: authorUID,
      createdAt: DateUtility.fromISO(wpNews.postDate),
      publishedAt: DateUtility.fromISO(wpNews.postDate),
      lastSyncAt: DateUtility.fromISO(wpNews.postModified),
      section: wpNews.newsSection,
      theme: wpNews.theme,
      tags: List(wpNews.tags),
      status: wpNews.status,
      newsBodyList: List(newsBodyList),
    }

    return news
  }

  private async index(trxProvider: TrxProvider, uid: string, action: Action): Promise<void> {
    const indexTask: IndexTask = {
      referenceUID: uid,
      referenceType: ReferenceType.NEWS,
      action: action,
    }
    await this.indexTaskQueue.save(trxProvider, indexTask)
  }

  public async getByUIDOrAlternativeLink(newsLink: string): Promise<ObjectWithAuthorFields<News>> {
    logger.debug('news.service.getByUIDOrAlternativeLink.start')
    let field = 'uid'
    const isUUID = UIDUtility.isStringHasUIDFormat(newsLink)
    if (!isUUID) {
      field = 'alternativeLink'
    }

    const news = await this.getBy(field, newsLink)

    logger.debug('news.service.getByUIDOrAlternativeLink.start')
    return news
  }

  public async save(wpNews: WPNews): Promise<string> {
    logger.debug('news.service.save.start')

    return TrxUtility.transactional<string>(this.db, async trxProvider => {
      const news = await this.constructNewsFromWP(trxProvider, wpNews)
      const uid = await this.dao.saveOrUpdate(trxProvider, news)
      await this.index(trxProvider, uid, Action.INDEX)
      logger.debug('news.service.save.done')
      return uid
    })
  }

  public async delete(uid: string): Promise<void> {
    logger.debug('news.service.delete.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.delete(trxProvider, uid)
      await this.index(trxProvider, uid, Action.DELETE)
      logger.debug('news.service.delete.done')
    })
  }

  public async getBy(field: string, value: string): Promise<ObjectWithAuthorFields<News>> {
    logger.debug('news.service.get-by.start')
    return TrxUtility.transactional<ObjectWithAuthorFields<News>>(this.db, async trxProvider => {
      const news = await this.dao.getBy(trxProvider, field, value)

      if (!news) {
        throw new ServerError('Not found', 404, NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR, 'news')
      }
      logger.debug('news.service.get-by.done')
      return news
    })
  }

  public async getNewsByStatuses(
    newsStatuses: Array<NewsStatus>,
  ): Promise<Array<Record<string, string>>> {
    logger.debug('news.service.get-news-by-statuses.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      const list = await this.dao.getNewsUIDsByStatuses(trxProvider, newsStatuses)
      logger.debug('news.service.get-news-by-statuses.done')
      return list
    })
  }

  public async updateCommentsCount(uid: string, commentValue: number, acs: ACS): Promise<void> {
    logger.debug('news.service.update-comments-count.start')
    return TrxUtility.transactional(this.db, async trxProvider => {
      await this.dao.updateCommentsCount(trxProvider, uid, commentValue, acs)
      logger.debug('news.service.update-comments-count.done')
    })
  }

  public async getGroupedThemeNews(rowsNumber: number): Promise<ThemedNews> {
    logger.debug('news.service.get-grouped-theme-news.start')
    return TrxUtility.transactional<ThemedNews>(this.db, async trxProvider => {
      const list = await this.dao.getGroupedThemeNews(trxProvider, rowsNumber)
      logger.debug('news.service.get-grouped-theme-news.done')
      return list
    })
  }

  public async getAnalyticalNews(rowsNumber: number): Promise<Array<News>> {
    logger.debug('news.service.get-analytical-news.start')
    return TrxUtility.transactional<Array<News>>(this.db, async trxProvider => {
      const list = await this.dao.getAnalyticalNews(trxProvider, rowsNumber)
      logger.debug('news.service.get-analytical-news.done')
      return list
    })
  }

  public async getMainNews(rowsNumber: number): Promise<Array<News>> {
    logger.debug('news.service.get-main-news.start')
    return TrxUtility.transactional<Array<News>>(this.db, async trxProvider => {
      const list = await this.dao.getMainNews(trxProvider, rowsNumber)
      logger.debug('news.service.get-main-news.done')
      return list
    })
  }

  public async list(filterParams: NewsListFilter, acs: ACS): Promise<PagedList<News>> {
    logger.debug('news.service.list.start')
    const UIDs = filterParams.elastic && (await this.findInElastic(filterParams.elastic))

    return TrxUtility.transactional<PagedList<News>>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider, filterParams, acs, UIDs)
      logger.debug('news.service.list.done')
      return list
    })
  }

  private async findInElastic(elastic: ElasticParams): Promise<Array<string>> {
    const builder = esb.boolQuery()
    if (elastic.theme) {
      builder.must(esb.termQuery('theme', elastic.theme.toLowerCase()))
    }
    if (elastic.section) {
      builder.must(esb.termQuery('section', elastic.section.toLowerCase()))
    }

    if (elastic.tags) {
      const tagsQuery = elastic.tags.map(tag => esb.termQuery('tags', tag.toLowerCase()))
      builder.must(esb.boolQuery().should(tagsQuery))
    }

    if (elastic.exclTags) {
      const exclTagsQuery = elastic.exclTags.map(exclTags =>
        esb.termQuery('tags', exclTags.toLowerCase()),
      )
      builder.mustNot(esb.boolQuery().should(exclTagsQuery))
    }

    if (elastic.publishedAtStart) {
      builder.must(esb.rangeQuery('publishedAt').gte(elastic.publishedAtStart.toISOString()))
    }

    if (elastic.publishedAtEnd) {
      builder.must(esb.rangeQuery('publishedAt').lte(elastic.publishedAtEnd.toISOString()))
    }

    if (elastic.hasPollLink) {
      builder.must(esb.termQuery('hasPollLink', elastic.hasPollLink))
    }

    if (elastic.searchTerm) {
      const fields = ['newsBody^3']

      if (!elastic.tags) {
        fields.push('tags^1')
      }
      builder.must(esb.multiMatchQuery(fields, elastic.searchTerm))
    }

    const data = await this.elasticClient.search<NewsIndex>('news', builder.toJSON())
    return data.hits.map(el => el._id)
  }
}
