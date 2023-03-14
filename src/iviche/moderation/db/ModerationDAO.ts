import { TrxProvider } from '../../db/TrxProvider'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { Moderation } from '../model/Moderation'
import { ModerationResolve } from '../model/ModerationResolve'
import { ModerationType } from '../model/ModerationType'

export interface ModerationDAO {
  save(
    trxProvider: TrxProvider,
    type: ModerationType,
    reference: string,
    summary: string,
  ): Promise<void>

  resolveOrReject(trxProvider: TrxProvider, moderation: ModerationResolve): Promise<void>

  get(trxProvider: TrxProvider, uid: string): Promise<Moderation | undefined>

  list(trxProvider: TrxProvider, filter: EntityFilter): Promise<PagedList<Moderation>>

  getModerationResult(
    trxProvider: TrxProvider,
    entityUID: string,
    moderationType: ModerationType,
  ): Promise<Moderation | undefined>
}
