import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { validate } from '../../../common/validators/ValidationMiddleware'
import { NotFoundErrorCodes } from '../../../error/DetailErrorCodes'
import { ServerError } from '../../../error/ServerError'
import { FilterValidator } from '../../../generic/validator/FilterValidator'
import { logger } from '../../../logger/LoggerFactory'
import { ModerationService } from '../../../moderation/service/ModerationService'
import { ModerationResolutionValidator } from '../../../moderation/validator/ModerationValidator'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'
import { FilterModelConstructor } from '../FilterModelConstructor'
import { ModerationResolutionConstructor } from './ModerationResolutionConstructor'

@injectable()
export class ModerationController implements Controller {
  private modelConstructor: ModerationResolutionConstructor = new ModerationResolutionConstructor()
  private filterConstructor: FilterModelConstructor = new FilterModelConstructor()
  private filterValidator: FilterValidator = new FilterValidator()
  private validator = new ModerationResolutionValidator()

  constructor(@inject('ModerationService') private service: ModerationService) {}

  public path(): string {
    return '/moderation-cases'
  }

  public initialize(router: Router): void {
    router.get('/:uid', verifyAccess('moderation'), this.get)
    router.get(
      '/',
      verifyAccess('moderation'),
      validate(this.filterConstructor, this.filterValidator),
      this.list,
    )
    router.put(
      '/:uid',
      verifyAccess('moderation'),
      validate(this.modelConstructor, this.validator),
      this.changeResolution,
    )
  }

  public get = async (request: Request, response: Response): Promise<void> => {
    logger.debug('moderation.controller.uid.start')

    const result = await this.service.get(request.params.uid)

    if (!result) {
      logger.debug(`moderation.controller.get.not-found`)
      throw new ServerError(
        `Not found [moderation] entity for get`,
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'moderation',
      )
    }
    response.json(result)
    logger.debug('moderation.controller.uid.done')
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('moderation.controller.filtered-list.start')

    const list = await this.service.list(this.filterConstructor.constructPureObject(request))
    response.json(list)
    logger.debug('moderation.controller.filtered-list.done')
  }

  public changeResolution = async (request: Request, response: Response): Promise<void> => {
    logger.debug('moderation.controller.create.start')
    await this.service.resolveOrReject(this.modelConstructor.constructPureObject(request))
    response.status(200).send()
    logger.debug('moderation.controller.create.done')
  }
}
