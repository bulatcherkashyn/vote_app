import { TrxProvider } from '../../db/TrxProvider'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { ThemedNews } from '../model/DashboardNews'
import { News } from '../model/News'
import { NewsStatus } from '../model/NewsStatus'

export interface NewsDAO {
  getBy(
    trxProvider: TrxProvider,
    field: string,
    value: string,
  ): Promise<ObjectWithAuthorDataObject<News> | undefined>

  saveOrUpdate(trxProvider: TrxProvider, news: News): Promise<string>

  delete(trxProvider: TrxProvider, uid: string): Promise<void>

  getGroupedThemeNews(trxProvider: TrxProvider, rowsNumber: number): Promise<ThemedNews>

  getAnalyticalNews(trxProvider: TrxProvider, rowsNumber: number): Promise<Array<News>>

  getMainNews(trxProvider: TrxProvider, rowsNumber: number): Promise<Array<News>>

  updateCommentsCount(
    trxProvider: TrxProvider,
    uid: string,
    commentValue: number,
    acs: ACS,
  ): Promise<void>

  getNewsUIDsByStatuses(
    trxProvider: TrxProvider,
    newsStatuses: Array<NewsStatus>,
  ): Promise<Array<Record<string, string>>>

  list(
    trxProvider: TrxProvider,
    filter: EntityFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<News>>
}
