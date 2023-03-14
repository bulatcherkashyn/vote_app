import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { validate } from '../../../common/validators/ValidationMiddleware'
import { logger } from '../../../logger/LoggerFactory'
import { PollService } from '../../../polls/services/PollService'
import { PollWatchService } from '../../../pollWatch/services/PollWatchService'
import { PollWatchBodyValidator } from '../../../pollWatch/validators/PollWatchBodyValidator'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'
import { PollWatchListModelConstructor } from './PollWatchListModelConstructor'
import { PollWatchModelConstructor } from './PollWatchModelConstructor'

@injectable()
export class PollWatchController implements Controller {
  private readonly modelConstructor = new PollWatchModelConstructor()
  private readonly listModelConstructor = new PollWatchListModelConstructor()
  private readonly validator = new PollWatchBodyValidator()

  constructor(
    @inject('PollWatchService')
    private readonly pollWatchService: PollWatchService,
    @inject('PollService')
    private readonly pollService: PollService,
  ) {}

  public path(): string {
    return '/poll-watches'
  }

  public initialize(router: Router): void {
    router.get('/', verifyAccess('list_poll_watch'), this.list)
    router.delete('/:uid', verifyAccess('delete_poll_watch'), this.delete)
    router.post(
      '/',
      verifyAccess('create_poll_watch'),
      validate(this.modelConstructor, this.validator),
      this.create,
    )
  }

  public delete = async (request: Request, response: Response): Promise<void> => {
    logger.debug('pollWatch.controller.delete.start')
    const uid = request.params.uid as string

    const result = await this.pollWatchService.delete(uid)

    response.json(result)
    logger.debug('pollWatch.controller.delete.done')
  }

  public create = async (request: Request, response: Response): Promise<void> => {
    logger.debug('pollWatch.controller.create.start')
    const pollWatch = this.modelConstructor.constructPureObject(request)
    const uid = await this.pollWatchService.save(pollWatch, request.accessRules)
    response.json(uid)
    logger.debug('pollWatch.controller.create.done')
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('pollWatch.controller.list.start')
    const queryParams = this.listModelConstructor.constructPureObject(request)
    const list = await this.pollWatchService.list(queryParams, request.accessRules)

    response.json(list)
    logger.debug('pollWatch.controller.list.done')
  }
}
