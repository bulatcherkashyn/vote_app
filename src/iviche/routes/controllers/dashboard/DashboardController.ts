import { Request, Response, Router } from 'express'
import requestIp from 'request-ip'
import { inject, injectable } from 'tsyringe'

import { Region } from '../../../common/Region'
import { UserRole } from '../../../common/UserRole'
import { validate } from '../../../common/validators/ValidationMiddleware'
import { DashboardService } from '../../../dashboard/service/DashboardService'
import { DashboardMainValidator } from '../../../dashboard/validator/DashboardMainValidator'
import { ConstructFrom } from '../../../generic/model/ConstructSingleFieldObject'
import { SingleFieldObjectConstructor } from '../../../generic/utils/SingleFieldObjectConstructor'
import { LocationService } from '../../../location/service/LocationService'
import { logger } from '../../../logger/LoggerFactory'
import { PersonService } from '../../../person/service/PersonService'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'

@injectable()
export class DashboardController implements Controller {
  private mainValidator = new DashboardMainValidator()
  private regionConstructor = new SingleFieldObjectConstructor('region', ConstructFrom.QUERY)

  constructor(
    @inject('PersonService') private personService: PersonService,
    @inject('DashboardService') private dashboardService: DashboardService,
    @inject('LocationService') private locationService: LocationService,
  ) {}

  public path(): string {
    return '/'
  }

  public initialize(router: Router): void {
    router.get(
      '/dashboard',
      verifyAccess('get_dashboard'),
      validate(this.regionConstructor, this.mainValidator),
      this.get,
    )
    router.get('/news-dashboard', verifyAccess('get_dashboard_news'), this.getDashboardNews)
  }

  public get = async (request: Request, response: Response): Promise<void> => {
    logger.debug('dashboard.controller.get.start')
    let region = request.query.region

    if (!region && request.user?.role !== UserRole.ANONYMOUS) {
      const person = await this.personService.getByUserUID(request.user?.uid)
      region = person?.addressRegion
    }

    if (!region || region === Region.UNKNOWN) {
      const ip = requestIp.getClientIp(request) as string
      region = await this.locationService.getRegionByIp(ip)
    }

    const dashboard = await this.dashboardService.mainDashboard(region)
    response.json(dashboard)

    logger.debug('dashboard.controller.get.done')
  }

  public getDashboardNews = async (request: Request, response: Response): Promise<void> => {
    logger.debug('dashboard.controller.get-dashboard-news.start')
    const news = await this.dashboardService.getDashboardNews()
    response.json(news)

    logger.debug('dashboard.controller.get-dashboard-news.done')
  }
}
