import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { CommentService } from '../../../comment/service/CommentService'
import { CommentValidator } from '../../../comment/validator/CommentValidator'
import { UUIDValidator } from '../../../common/validators/UUIDValidator'
import { validate } from '../../../common/validators/ValidationMiddleware'
import { NotFoundErrorCodes } from '../../../error/DetailErrorCodes'
import { ServerError } from '../../../error/ServerError'
import { ConstructFrom } from '../../../generic/model/ConstructSingleFieldObject'
import { SingleFieldObjectConstructor } from '../../../generic/utils/SingleFieldObjectConstructor'
import { logger } from '../../../logger/LoggerFactory'
import { PollWatchService } from '../../../pollWatch/services/PollWatchService'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { GrandAccessACS } from '../../../security/acs/strategies'
import { Controller } from '../Controller'
import { PollWatchModelConstructor } from '../pollWatch/PollWatchModelConstructor'
import { CommentModelConstructor } from './CommentModelConstructor'

@injectable()
export class CommentController implements Controller {
  private modelConstructor = new CommentModelConstructor()
  private validator = new CommentValidator()
  private uuidValidator = new UUIDValidator()
  private pollWatchModelConstructor = new PollWatchModelConstructor()
  private uuidModelConstructor = new SingleFieldObjectConstructor('uid', ConstructFrom.PARAMS)

  constructor(
    @inject('CommentService') private commentService: CommentService,
    @inject('PollWatchService') private pollWatchService: PollWatchService,
  ) {}

  public path(): string {
    return '/'
  }

  public initialize(router: Router): void {
    const prefix = '/:entityType/:entityUID/comments'
    router.get(prefix, verifyAccess('get_comment_thread'), this.getThread)
    router.post(
      prefix,
      verifyAccess('save_comment_thread'),
      validate(this.modelConstructor, this.validator),
      this.create,
    )
    router.patch(
      prefix + '/:uid',
      verifyAccess('update_comment_thread'),
      validate(this.modelConstructor, this.validator),
      validate(this.uuidModelConstructor, this.uuidValidator),
      this.update,
    )
    router.delete(
      prefix + '/:uid',
      verifyAccess('delete_comment_thread'),
      validate(this.uuidModelConstructor, this.uuidValidator),
      this.delete,
    )
  }

  public create = async (request: Request, response: Response): Promise<void> => {
    logger.debug('comment.controller.create.start')

    const model = this.modelConstructor.constructPureObject(request)
    const uid = await this.commentService.save(model, new GrandAccessACS())

    response.json({ uid })
    logger.debug('comment.controller.create.done')
    if (model.entityUID) {
      logger.debug('comment.controller.create.pollWatch.start')
      const pollWatchModel = await this.pollWatchModelConstructor.constructPureObjectWithUID(
        request,
        model.entityUID,
      )
      await this.pollWatchService.save(pollWatchModel, new GrandAccessACS())
    }
    logger.debug('comment.controller.create.pollWatch.done')
  }

  public update = async (request: Request, response: Response): Promise<void> => {
    logger.debug('comment.controller.update.start')

    const comment = await this.commentService.get(request.params.uid)
    if (!comment) {
      throw new ServerError(
        'Comment not found',
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'uid',
      )
    }

    const newComment = {
      ...comment,
      text: request.body.text,
    }

    const uid = await this.commentService.save(newComment, request.accessRules)
    response.json({ uid })
    logger.debug('comment.controller.update.done')
  }

  public getThread = async (request: Request, response: Response): Promise<void> => {
    logger.debug('comment.controller.get-thread.start')
    const comment = await this.commentService.getCommentThreads(
      request.params.entityType,
      request.params.entityUID,
      request.user && request.user.uid,
    )

    response.json(comment)
    logger.debug('comment.controller.get-thread.done')
  }

  public delete = async (request: Request, response: Response): Promise<void> => {
    logger.debug('comment.controller.delete.start')

    await this.commentService.delete(request.params.uid, request.accessRules)

    response.status(204).send()
    logger.debug('comment.controller.delete.done')
  }
}
