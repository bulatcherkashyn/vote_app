import { GenericService } from '../../generic/service/GenericService'
import { Poll } from '../../polls/models/Poll'
import { ACS } from '../../security/acs/models/ACS'
import { RatingMonitor } from '../models/RatingMonitor'

export interface RatingMonitorService extends GenericService<RatingMonitor> {
  savePoll(poll: Poll | RatingMonitor, saveAsDraft: boolean, acs: ACS): Promise<string>
  stopRatingMonitor(uid: string): Promise<void>
}
