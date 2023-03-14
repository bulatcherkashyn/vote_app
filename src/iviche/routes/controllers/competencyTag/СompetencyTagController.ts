import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { CompetencyTagService } from '../../../competencyTag/service/CompetencyTagService'
import { logger } from '../../../logger/LoggerFactory'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'

@injectable()
export class СompetencyTagController implements Controller {
  constructor(@inject('CompetencyTagService') private competencyTagService: CompetencyTagService) {}

  public path(): string {
    return '/competency-tags'
  }

  public initialize(router: Router): void {
    router.get('/', verifyAccess('competency_tag_list'), this.getCompetencyTags)
  }

  public getCompetencyTags = async (request: Request, response: Response): Promise<void> => {
    logger.debug('сompetency-tags.controller.list.start')

    const result = this.competencyTagService.getCompetencyTags()

    response.json(result)
    logger.debug('сompetency-tags.controller.list.done')
  }
}
