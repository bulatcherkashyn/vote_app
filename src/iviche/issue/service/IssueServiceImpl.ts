import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxUtility } from '../../db/TrxUtility'
import { PagedList } from '../../generic/model/PagedList'
import { logger } from '../../logger/LoggerFactory'
import { ACS } from '../../security/acs/models/ACS'
import { IssueDAO } from '../db/IssueDAO'
import { Issue } from '../model/Issue'
import { IssueListFilter } from '../model/IssueQueryList'
import { IssueResolve } from '../model/IssueResolve'
import { IssueService } from './IssueService'

@injectable()
export class IssueServiceImpl implements IssueService {
  constructor(
    @inject('IssueDAO') private dao: IssueDAO,
    @inject('DBConnection') private db: Knex,
  ) {}

  public async save(issue: Issue, acs: ACS): Promise<void> {
    logger.debug('issue.service.create.start')

    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.save(trxProvider, issue, acs)
      logger.debug('issue.service.create.done')
    })
  }

  public async get(uid: string): Promise<Issue | undefined> {
    logger.debug('issue.service.get.start')

    return TrxUtility.transactional<Issue | undefined>(this.db, async trxProvider => {
      const issue = await this.dao.get(trxProvider, uid)
      logger.debug('issue.service.get.done')
      return issue
    })
  }

  public async list(filter: IssueListFilter): Promise<PagedList<Issue>> {
    logger.debug('issue.service.list.start')

    return TrxUtility.transactional<PagedList<Issue>>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider, filter)
      logger.debug('issue.service.list.done')
      return list
    })
  }

  public async changeResolution(issue: IssueResolve): Promise<void> {
    logger.debug('issue.service.change-resolution.start')

    return await TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.changeResolution(trxProvider, issue)
      logger.debug('issue.service.change-resolution.done')
    })
  }
}
