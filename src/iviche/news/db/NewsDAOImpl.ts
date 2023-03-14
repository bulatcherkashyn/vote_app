import { oneLine } from 'common-tags'
import { List } from 'immutable'
import { Transaction } from 'knex'
import uuidv4 from 'uuid/v4'

import { sortByUIDQuery } from '../../common/SortByUIDQuery'
import { TrxProvider } from '../../db/TrxProvider'
import { ServerError } from '../../error/ServerError'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { appendAuthorDataQuery } from '../../person/db/AuthorDataDAOUtility'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { NewsDBTuple } from '../dto/NewsDBTuple'
import { ThemedNews } from '../model/DashboardNews'
import { News } from '../model/News'
import { NewsBody } from '../model/NewsBody'
import { NewsListFilter } from '../model/NewsQueryList'
import { NewsSection } from '../model/NewsSection'
import { NewsStatus } from '../model/NewsStatus'
import { NewsTheme } from '../model/NewsTheme'
import { NewsDAO } from './NewsDAO'
import { NewsDTOHelper } from './NewsDTOHelper'

export class NewsDAOImpl implements NewsDAO {
  private static async createNewsBodies(
    trx: Transaction,
    newsBodyList: Array<NewsBody>,
    newsUID: string,
  ): Promise<void> {
    logger.debug('news.dao.create.news-body.start')
    const insertData: Array<NewsBody> = newsBodyList.map(el => ({
      uid: uuidv4(),
      body: el.body,
      language: el.language,
      seoTitle: el.seoTitle,
      seoDescription: el.seoDescription,
      shortDescription: el.shortDescription,
      title: el.title,
      newsUID,
    }))

    await trx('news_body').insert(insertData)
    logger.debug('news.dao.create.news-body.done')
  }

  public async updateCommentsCount(
    trxProvider: TrxProvider,
    uid: string,
    commentValue: number,
  ): Promise<void> {
    logger.debug('news.dao.update-comment-count.start')
    const trx = await trxProvider()
    await trx('news')
      .where({ uid })
      .update({ commentsCount: commentValue })
    logger.debug('news.dao.update-comment-count.done')
  }

  public async getNewsUIDsByStatuses(
    trxProvider: TrxProvider,
    newsStatuses: Array<NewsStatus>,
  ): Promise<Array<Record<string, string>>> {
    logger.debug('news.dao.get-news-uids-by-statuses.start')
    const trx = await trxProvider()

    const newsUIDs = await trx<string>('news')
      .select('uid')
      .whereIn('status', newsStatuses)

    logger.debug('news.dao.get-news-uids-by-statuses.done')
    return newsUIDs
  }

  private static async create(trxProvider: TrxProvider, news: News): Promise<string> {
    logger.debug('news.dao.create.start')

    const uuid = uuidv4()
    const trx = await trxProvider()
    await trx('news').insert({
      uid: uuid,
      wpID: news.wpID,
      alternativeLink: news.alternativeLink,
      headerImage: news.headerImage,
      authorUID: news.authorUID,
      pollUID: news.pollUID,
      tags: JSON.stringify(news.tags.toArray()),
      status: news.status,
      section: news.section,
      theme: news.theme,
      createdAt: news.createdAt,
      publishedAt: news.publishedAt,
      lastSyncAt: news.lastSyncAt,
    })

    await NewsDAOImpl.createNewsBodies(trx, news.newsBodyList.toArray(), uuid)

    logger.debug('news.dao.create.done')
    return uuid
  }

  private static async updateSingleNewsBody(
    trx: Transaction,
    bodyPart: NewsBody,
    newsUID: string,
  ): Promise<void> {
    logger.debug('news.dao.update.news-body.start')

    await trx('news_body')
      .where({ uid: bodyPart.uid, newsUID: newsUID })
      .update({
        language: bodyPart.language,
        title: bodyPart.title,
        body: bodyPart.body,
        shortDescription: bodyPart.shortDescription,
      })

    logger.debug('news.dao.update.news-body.done')
  }

  private static async getGroupedNewsByUIDs(
    trx: Transaction,
    groupedNewsUIDs: Array<string>,
  ): Promise<Array<NewsDBTuple>> {
    return trx<NewsDBTuple>('news')
      .select(
        'news.uid as uid',
        'news.alternativeLink as alternativeLink',
        'news.section as section',
        'news.theme as theme',
        'news.headerImage as headerImage',
        'news.status as status',
        'news.createdAt as createdAt',
        'news.publishedAt as publishedAt',
        'news.lastSyncAt as lastSyncAt',
        'news.tags as tags',
        'news.authorUID as authorUID',
        'news.wpID as wpID',
        'news.pollUID as pollUID ',
        'news.commentsCount as commentsCount',
        'news_body.uid as bodyUid',
        'news_body.language as language',
        'news_body.seoTitle as seoTitle',
        'news_body.seoDescription as seoDescription',
        'news_body.title as title',
        'news_body.shortDescription as shortDescription',
        'news_body.newsUID as newsUID',
        'news_body.body as body',
      )
      .innerJoin('news_body', 'news.uid', 'news_body.newsUID')
      .whereIn('newsUID', groupedNewsUIDs)
      .orderBy('publishedAt', 'desc')
  }

  private static async updateNewsBodies(
    trx: Transaction,
    newsBodyList: List<NewsBody>,
    newsUID: string,
  ): Promise<void> {
    logger.debug('news.dao.update.news-body-list.start')

    const update: Array<NewsBody> = newsBodyList.filter(singleBody => !!singleBody.uid).toArray()
    const create: Array<NewsBody> = newsBodyList.filter(singleBody => !singleBody.uid).toArray()

    await NewsDAOImpl.deleteNewsBodiesForNews(
      trx,
      newsUID,
      update.map(body => body.uid as string),
    )

    for (const part of update) {
      await NewsDAOImpl.updateSingleNewsBody(trx, part, newsUID)
    }

    if (create.length) {
      await this.createNewsBodies(trx, create, newsUID)
    }

    logger.debug('news.dao.update.news-body-list.done')
  }

  private static async update(trxProvider: TrxProvider, news: News): Promise<void> {
    logger.debug('news.dao.update.start')
    const trx = await trxProvider()

    if (news.newsBodyList.toArray().length === 0) {
      logger.debug('news.dao.update.error')
      throw new ServerError('Update for entity news failed, newsBody is empty')
    }

    const result = await trx('news')
      .where({ uid: news.uid })
      .update({
        wpID: news.wpID,
        alternativeLink: news.alternativeLink,
        authorUID: news.authorUID,
        headerImage: news.headerImage,
        pollUID: news.pollUID,
        tags: news.tags,
        status: news.status,
        section: news.section,
        theme: news.theme,
        lastSyncAt: news.lastSyncAt,
      })

    checkDAOResult(result, 'news', 'update')
    logger.debug('news.dao.update.news-body-list.pre')
    await NewsDAOImpl.updateNewsBodies(trx, news.newsBodyList, news.uid || '')

    logger.debug('news.dao.update.done')
  }

  public async saveOrUpdate(trxProvider: TrxProvider, entity: News): Promise<string> {
    logger.debug('news.dao.save-or-update')
    if (entity.uid) {
      await NewsDAOImpl.update(trxProvider, entity)
      return entity.uid as string
    } else {
      return NewsDAOImpl.create(trxProvider, entity)
    }
  }

  public async getBy(
    trxProvider: TrxProvider,
    field: string,
    value: string,
  ): Promise<ObjectWithAuthorDataObject<News> | undefined> {
    logger.debug('news.dao.get-by.start')
    const trx = await trxProvider()

    const newsTuplesQuery = trx<NewsDBTuple | undefined>('news')
      .select(
        'news.uid as uid',
        'news.alternativeLink as alternativeLink',
        'news.section as section',
        'news.theme as theme',
        'news.headerImage as headerImage',
        'news.status as status',
        'news.createdAt as createdAt',
        'news.publishedAt as publishedAt',
        'news.lastSyncAt as lastSyncAt',
        'news.tags as tags',
        'news.wpID as wpID',
        'news.authorUID as authorUID',
        'news.pollUID as pollUID ',
        'news.commentsCount as commentsCount',
        'news_body.uid as bodyUid',
        'news_body.language as language',
        'news_body.seoTitle as seoTitle',
        'news_body.seoDescription as seoDescription',
        'news_body.title as title',
        'news_body.shortDescription as shortDescription',
        'news_body.newsUID as newsUID',
        'news_body.body as body',
      )
      .innerJoin('news_body', 'news.uid', 'news_body.newsUID')
      .where(`news.${field}`, value)
    appendAuthorDataQuery(newsTuplesQuery, 'news')
    newsTuplesQuery.select('authorPerson.bio as authorBio')
    const newsTuples = await newsTuplesQuery

    if (!newsTuples || newsTuples.length === 0) {
      return undefined
    }

    const singleObjectArray = NewsDTOHelper.constructNewsArrayFromTuplesArray(newsTuples)
    if (singleObjectArray.length !== 1) {
      throw new ServerError('Cannot get single News from loaded data')
    }

    logger.debug('news.dao.get-by.done')

    return singleObjectArray[0]
  }

  private static async deleteNewsBodiesForNews(
    trx: Transaction,
    newsUID: string,
    except?: Array<string>,
  ): Promise<void> {
    logger.debug('news.dao.delete.news-body-list.start')
    const queryBuilder = trx('news_body').where({ newsUID })

    if (except && except.length) {
      queryBuilder.whereNotIn('uid', except)
    }

    await queryBuilder.delete()
    logger.debug('news.dao.delete.news-body-list.done')
  }

  public async delete(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('news.dao.delete.start')
    const trx = await trxProvider()

    await NewsDAOImpl.deleteNewsBodiesForNews(trx, uid)

    const result = await trx('news')
      .where({ uid: uid })
      .delete()

    checkDAOResult(result, 'news', 'delete')
    logger.debug('news.dao.delete.done')
  }

  public async getGroupedThemeNews(
    trxProvider: TrxProvider,
    rowsNumber: number,
  ): Promise<ThemedNews> {
    logger.debug('news.dao.get-grouped-theme-news.start')

    const trx = await trxProvider()
    const themes = Object.values(NewsTheme).join(`', '`)
    const groupedThemedNewsUIDTuples = await trx
      .from(
        trx.raw(oneLine`
          (select news.uid, row_number()
            over(partition by theme order by "publishedAt" desc) as row_num
            from news
            where theme IN ('${themes}')
          ) as T`),
      )
      .where(trx.raw(`T.row_num <= ${rowsNumber}`))

    const groupedNewsUIDs = groupedThemedNewsUIDTuples.map(
      (tuple: { uid: string; row_num: string }) => tuple.uid,
    )

    if (!groupedNewsUIDs.length) {
      return NewsDTOHelper.getEmptyThemedNews()
    }

    const groupedThemedNewsTuples = await NewsDAOImpl.getGroupedNewsByUIDs(trx, groupedNewsUIDs)

    const newsArray = NewsDTOHelper.constructNewsArrayFromTuplesArray(groupedThemedNewsTuples)
    const themedNewsObject = NewsDTOHelper.constructThemedNewsGroups(newsArray)

    logger.debug('news.dao.get-grouped-theme-news.done')
    return themedNewsObject
  }

  public async getAnalyticalNews(
    trxProvider: TrxProvider,
    rowsNumber: number,
  ): Promise<Array<News>> {
    logger.debug('news.dao.get-analytical-news.start')

    const trx = await trxProvider()
    const analyticalNews = await trx<NewsDBTuple>('news')
      .select(
        'news.uid as uid',
        'news.alternativeLink as alternativeLink',
        'news.section as section',
        'news.theme as theme',
        'news.headerImage as headerImage',
        'news.status as status',
        'news.createdAt as createdAt',
        'news.publishedAt as publishedAt',
        'news.lastSyncAt as lastSyncAt',
        'news.tags as tags',
        'news.authorUID as authorUID',
        'news.wpID as wpID',
        'news.pollUID as pollUID ',
        'news_body.uid as bodyUid',
        'news_body.language as language',
        'news_body.seoTitle as seoTitle',
        'news_body.seoDescription as seoDescription',
        'news_body.title as title',
        'news_body.shortDescription as shortDescription',
        'news_body.newsUID as newsUID',
        'news_body.body as body',
      )
      .innerJoin('news_body', 'news.uid', 'news_body.newsUID')
      .orderBy('publishedAt', 'desc')
      .whereNotNull('pollUID')
      .limit(rowsNumber)

    const newsArray = NewsDTOHelper.constructNewsArrayFromTuplesArray(analyticalNews)

    logger.debug('news.dao.get-analytical-news.done')
    return newsArray
  }

  public async getMainNews(trxProvider: TrxProvider, rowsNumber: number): Promise<Array<News>> {
    logger.debug('news.dao.get-main-news.start')
    const trx = await trxProvider()

    const mainNews = await trx<NewsDBTuple>('news')
      .select(
        'news.uid as uid',
        'news.alternativeLink as alternativeLink',
        'news.section as section',
        'news.theme as theme',
        'news.headerImage as headerImage',
        'news.status as status',
        'news.createdAt as createdAt',
        'news.publishedAt as publishedAt',
        'news.lastSyncAt as lastSyncAt',
        'news.tags as tags',
        'news.authorUID as authorUID',
        'news.wpID as wpID',
        'news.pollUID as pollUID ',
        'news.commentsCount as commentsCount',
        'news_body.uid as bodyUid',
        'news_body.language as language',
        'news_body.seoTitle as seoTitle',
        'news_body.seoDescription as seoDescription',
        'news_body.title as title',
        'news_body.shortDescription as shortDescription',
        'news_body.newsUID as newsUID',
        'news_body.body as body',
      )
      .orderBy('publishedAt', 'desc')
      .innerJoin('news_body', 'news.uid', 'news_body.newsUID')
      .whereIn('news.uid', function() {
        return this.from('news')
          .select('uid')
          .where('section', NewsSection.MAIN)
          .orderBy('publishedAt', 'desc')
          .limit(rowsNumber)
      })

    const newsArray = NewsDTOHelper.constructNewsArrayFromTuplesArray(mainNews)

    logger.debug('news.dao.get-main-news.done')
    return newsArray
  }

  public async list(
    trxProvider: TrxProvider,
    params: NewsListFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<News>> {
    logger.debug('news.dao.list.start')
    const trx = await trxProvider()

    const mainQuery = trx<News>('news').where(acs.toSQL('news.authorUID'))
    if (UIDs) {
      mainQuery.whereIn('news.uid', UIDs)
    }
    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      mainQuery,
      params,
    )
    logger.debug('news.dao.list.counted')

    const newsTuplesQuery = trx<NewsDBTuple>('news')
      .select(
        'news.uid as uid',
        'news.alternativeLink as alternativeLink',
        'news.section as section',
        'news.theme as theme',
        'news.headerImage as headerImage',
        'news.status as status',
        'news.createdAt as createdAt',
        'news.publishedAt as publishedAt',
        'news.lastSyncAt as lastSyncAt',
        'news.tags as tags',
        'news.authorUID as authorUID',
        'news.wpID as wpID',
        'news.pollUID as pollUID ',
        'news.commentsCount as commentsCount',
        'news_body.uid as bodyUid',
        'news_body.language as language',
        'news_body.seoTitle as seoTitle',
        'news_body.seoDescription as seoDescription',
        'news_body.title as title',
        'news_body.shortDescription as shortDescription',
        'news_body.newsUID as newsUID',
        'news_body.body as body',
      )
      .innerJoin('news_body', 'news.uid', 'news_body.newsUID')
      .whereIn(
        'news.uid',
        PaginationUtility.applyPaginationForQuery(mainQuery, params).select('uid'),
      )

    if (params.elastic?.searchTerm) {
      sortByUIDQuery(newsTuplesQuery, UIDs, 'news.uid')
    } else if (params.order) {
      newsTuplesQuery.orderBy(params.order.orderBy, params.order.asc ? 'asc' : 'desc')
    }

    const newsTuples = await newsTuplesQuery
    logger.debug('news.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(NewsDTOHelper.constructNewsArrayFromTuplesArray(newsTuples)),
    }
  }
}
