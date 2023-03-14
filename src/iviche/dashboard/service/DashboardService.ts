import { Region } from '../../common/Region'
import { DashboardNews } from '../../news/model/DashboardNews'
import { Dashboard } from '../model/Dashboard'

export interface DashboardService {
  mainDashboard(region: Region): Promise<Dashboard>
  getDashboardNews(): Promise<DashboardNews>
}
