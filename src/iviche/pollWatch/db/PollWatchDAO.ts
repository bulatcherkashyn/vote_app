import { TrxProvider } from '../../db/TrxProvider'
import { GenericDAO } from '../../generic/dao/GenericDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { ACS } from '../../security/acs/models/ACS'
import PollWatch from '../models/PollWatch'

export interface PollWatchDAO extends GenericDAO<PollWatch> {
  get(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<PollWatch | undefined>

  list(
    trxProvider: TrxProvider,
    params: EntityFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<PollWatch>>

  delete(trxProvider: TrxProvider, uid: string): Promise<void>
}
