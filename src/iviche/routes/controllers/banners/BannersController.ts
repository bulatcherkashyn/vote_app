import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { BannerService } from '../../../banner/services/BannerService'
import { logger } from '../../../logger/LoggerFactory'
import { Controller } from '../Controller'

@injectable()
export class BannersController implements Controller {
  constructor(@inject('BannerService') private bannerService: BannerService) {}

  public path(): string {
    return '/banners'
  }

  public initialize(router: Router): void {
    router.get('/', this.list)
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('banners.controller.list.start')

    const result = await this.bannerService.list()
    response.json(result)

    logger.debug('banners.controller.list.done')
  }
}
