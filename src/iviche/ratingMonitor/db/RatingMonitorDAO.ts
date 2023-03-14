import { TrxProvider } from '../../db/TrxProvider'
import { GenericDAO } from '../../generic/dao/GenericDAO'
import { RatingMonitor } from '../models/RatingMonitor'

export interface RatingMonitorDAO extends GenericDAO<RatingMonitor> {
  stopMonitor(trx: TrxProvider, uid: string): Promise<void>
}
