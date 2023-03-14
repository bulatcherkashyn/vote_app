import { PagedList } from '../../generic/model/PagedList'
import { ObjectWithAuthorFields } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { ThemedNews } from '../model/DashboardNews'
import { News } from '../model/News'
import { NewsListFilter } from '../model/NewsQueryList'
import { NewsStatus } from '../model/NewsStatus'
import { WPNews } from '../model/WPNews'

export interface NewsService {
  save(wpNews: WPNews): Promise<string>

  delete(uid: string): Promise<void>

  getBy(field: string, value: string): Promise<ObjectWithAuthorFields<News> | undefined>

  getByUIDOrAlternativeLink(newsLink: string): Promise<ObjectWithAuthorFields<News> | undefined>

  getGroupedThemeNews(rowsNumber: number): Promise<ThemedNews>

  updateCommentsCount(uid: string, commentValue: number, acs: ACS): Promise<void>

  getAnalyticalNews(rowsNumber: number): Promise<Array<News>>

  getMainNews(rowsNumber: number): Promise<Array<News>>

  getNewsByStatuses(pollStatuses: Array<NewsStatus>): Promise<Array<Record<string, string>>>

  list(filter: NewsListFilter, acs: ACS): Promise<PagedList<News>>
}
