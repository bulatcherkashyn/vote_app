import { TrxProvider } from '../../db/TrxProvider'
import { PagedList } from '../../generic/model/PagedList'
import { ACS } from '../../security/acs/models/ACS'
import { Issue } from '../model/Issue'
import { IssueListFilter } from '../model/IssueQueryList'
import { IssueResolve } from '../model/IssueResolve'

export interface IssueDAO {
  save(trxProvider: TrxProvider, issue: Issue, acs: ACS): Promise<void>

  changeResolution(trxProvider: TrxProvider, issue: IssueResolve): Promise<void>

  get(trxProvider: TrxProvider, uid: string): Promise<Issue | undefined>

  list(trxProvider: TrxProvider, filter: IssueListFilter): Promise<PagedList<Issue>>
}
