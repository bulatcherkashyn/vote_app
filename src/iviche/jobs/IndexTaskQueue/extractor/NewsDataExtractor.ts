import { IndexDataExtractor } from '../IndexDataExtractor'
import Knex = require('knex')
import { TrxUtility } from '../../../db/TrxUtility'
import { Action, IndexTask } from '../../../indexTaskQueue/model/IndexTask'
import { NewsDTOHelper } from '../../../news/db/NewsDTOHelper'
import { NewsBody } from '../../../news/model/NewsBody'
import { NewsIndex } from '../../../news/model/NewsIndex'
import { PersonDAOImpl } from '../../../person/db/PersonDAOImpl'

export class NewsDataExtractor extends IndexDataExtractor {
  public async index(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void> {
    const indexTasksUIDs = tasks
      .filter(task => task.action === Action.INDEX)
      .map(task => task.referenceUID)
    if (!indexTasksUIDs.length) {
      return
    }

    await TrxUtility.transactional(knexConnection, async trxProvider => {
      const trx = await trxProvider()
      const newsTuple = await trx('news')
        .select(
          'news.*',
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
        .whereIn('news.uid', indexTasksUIDs)

      const news = NewsDTOHelper.constructNewsArrayFromTuplesArray(newsTuple)

      const newsIndexData = news.map(async newsEntity => {
        const newsBody = newsEntity.newsBodyList
          .map((news: NewsBody) => `${news.title} ${news.body}`)
          .join(' ')
        const authorData = await PersonDAOImpl.getAuthorData(trxProvider, newsEntity.authorUID)

        const body: NewsIndex = {
          uid: newsEntity.uid,
          authorName: (authorData.firstName || authorData.shortName) as string,
          tags: newsEntity.tags?.join(' '),
          status: newsEntity.status,
          section: newsEntity.section,
          theme: newsEntity.theme,
          publishedAt: newsEntity.publishedAt,
          hasPollLink: newsEntity.pollUID ? true : false,
          newsBody,
        }

        return body
      })

      const elasticData = await Promise.all(newsIndexData)

      await this.elastic.bulk('news', elasticData)
    })
  }

  public async delete(knexConnection: Knex, tasks: Array<IndexTask>): Promise<void> {
    const deleteTasksUIDs = tasks
      .filter(task => task.action === Action.DELETE)
      .map(task => task.referenceUID)

    if (!deleteTasksUIDs.length) {
      return
    }

    await this.elastic.deleteMany(deleteTasksUIDs, 'news')
  }
}
