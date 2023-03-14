import { News } from '../news/model/News'
import { NewsIndex } from '../news/model/NewsIndex'

export class NewsUtility {
  static toNewsIndex(news: News): NewsIndex {
    return {
      uid: news.uid as string,
      tags: news.tags?.join(' '),
      status: news.status,
      theme: news.theme,
      publishedAt: news.publishedAt,
      hasPollLink: !!news.pollUID,
      newsBody: '',
    }
  }
}
