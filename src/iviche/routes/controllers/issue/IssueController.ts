import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { validate } from '../../../common/validators/ValidationMiddleware'
import { NotFoundErrorCodes } from '../../../error/DetailErrorCodes'
import { ServerError } from '../../../error/ServerError'
import { IssueService } from '../../../issue/service/IssueService'
import { IssueQueryListValidator } from '../../../issue/validator/IssueQueryListValidator'
import { IssueResolutionValidator } from '../../../issue/validator/IssueResolutionValidator'
import { IssueValidator } from '../../../issue/validator/IssueValidator'
import { logger } from '../../../logger/LoggerFactory'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'
import { IssueListFilterConstructor } from './IssueListFilterConstructor'
import { IssueModelConstructor } from './IssueModelConstructor'
import { IssueResolutionConstructor } from './IssueResolutionConstructor'

@injectable()
export class IssueController implements Controller {
  private modelConstructor: IssueModelConstructor = new IssueModelConstructor()
  private validator: IssueValidator = new IssueValidator()

  private issueResolutionConstructor: IssueResolutionConstructor = new IssueResolutionConstructor()
  private issueResolutionValidator: IssueResolutionValidator = new IssueResolutionValidator()

  private listModelConstructor: IssueListFilterConstructor = new IssueListFilterConstructor()
  private listValidator: IssueQueryListValidator = new IssueQueryListValidator()

  constructor(@inject('IssueService') private service: IssueService) {}

  public path(): string {
    return '/issues'
  }

  public initialize(router: Router): void {
    router.post(
      '/',
      verifyAccess('save_issue'),
      validate(this.modelConstructor, this.validator),
      this.save,
    )
    router.get(
      '/',
      verifyAccess('get_issue'),
      validate(this.listModelConstructor, this.listValidator),
      this.list,
    )
    router.get('/:uid', verifyAccess('get_issue'), this.get)
    router.put(
      '/:uid',
      verifyAccess('update_issue'),
      validate(this.issueResolutionConstructor, this.issueResolutionValidator),
      this.changeResolution,
    )
  }

  public save = async (request: Request, response: Response): Promise<void> => {
    logger.debug('issue.controller.save.start')
    const issue = this.modelConstructor.constructPureObject(request)

    await this.service.save(issue, request.accessRules)

    response.status(201).send()
    logger.debug('issue.controller.save.done')
  }

  public get = async (request: Request, response: Response): Promise<void> => {
    logger.debug('issue.controller.get.start')

    const result = await this.service.get(request.params.uid)

    if (!result) {
      logger.debug(`issue.controller.get.not-found`)
      throw new ServerError(
        `Not found [issue] entity for get`,
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'issue',
      )
    }

    response.json(result)
    logger.debug('issue.controller.get.done')
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('issue.controller.filtered-list.start')

    const list = await this.service.list(this.listModelConstructor.constructPureObject(request))
    response.json(list)
    logger.debug('issue.controller.filtered-list.done')
  }

  // TODO handle change resolution from status PENDING to PENDING
  public changeResolution = async (request: Request, response: Response): Promise<void> => {
    logger.debug('issue.controller.change-resolution.start')
    await this.service.changeResolution(
      this.issueResolutionConstructor.constructPureObject(request),
    )
    response.status(200).send()
    logger.debug('issue.controller.change-resolution.done')
  }
}
