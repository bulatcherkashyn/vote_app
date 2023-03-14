import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { Moderation } from '../model/Moderation'
import { ModerationResolve } from '../model/ModerationResolve'
import { ModerationType } from '../model/ModerationType'

export interface ModerationService {
  save(type: ModerationType, reference: string, summary: string): Promise<void>

  resolveOrReject(moderation: ModerationResolve): Promise<void>

  get(uid: string): Promise<Moderation | undefined>

  list(filter: EntityFilter): Promise<PagedList<Moderation>>

  getModerationResult(uid: string, type: ModerationType): Promise<Moderation>
}
