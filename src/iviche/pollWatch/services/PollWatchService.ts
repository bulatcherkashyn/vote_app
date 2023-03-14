import { GenericService } from '../../generic/service/GenericService'
import { ACS } from '../../security/acs/models/ACS'
import PollWatch from '../models/PollWatch'

export interface PollWatchService extends GenericService<PollWatch> {
  delete(uid: string): Promise<void>

  save(entity: PollWatch, acs: ACS): Promise<string>
}
