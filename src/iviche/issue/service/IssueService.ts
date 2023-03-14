import { PagedList } from '../../generic/model/PagedList'
import { ACS } from '../../security/acs/models/ACS'
import { Issue } from '../model/Issue'
import { IssueListFilter } from '../model/IssueQueryList'
import { IssueResolve } from '../model/IssueResolve'

export interface IssueService {
  save(issue: Issue, acs: ACS): Promise<void>

  changeResolution(issue: IssueResolve): Promise<void>

  get(uid: string): Promise<Issue | undefined>

  list(filter: IssueListFilter): Promise<PagedList<Issue>>
}
