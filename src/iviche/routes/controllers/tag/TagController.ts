import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { validate } from '../../../common/validators/ValidationMiddleware'
import { logger } from '../../../logger/LoggerFactory'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { TagService } from '../../../tag/service/TagService'
import { TagValidator } from '../../../tag/validator/TagValidator'
import { Controller } from '../Controller'
import { TagModelConstructor } from './TagModelConstructor'

@injectable()
export class TagController implements Controller {
  private modelConstructor: TagModelConstructor = new TagModelConstructor()
  private validator: TagValidator = new TagValidator()

  constructor(@inject('TagService') private tagService: TagService) {}

  public path(): string {
    return '/tags'
  }

  public initialize(router: Router): void {
    router.get('/', verifyAccess('tags_list'), this.list)
    router.post(
      '/',
      verifyAccess('save_tag'),
      validate(this.modelConstructor, this.validator),
      this.create,
    )
    router.put(
      '/:uid',
      verifyAccess('update_tag'),
      validate(this.modelConstructor, this.validator),
      this.update,
    )
    router.delete('/:uid', verifyAccess('delete_tag'), this.delete)
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('tag.controller.list.start')

    const result = await this.tagService.list()

    response.json(result)
    logger.debug('tag.controller.list.done')
  }

  public create = async (request: Request, response: Response): Promise<void> => {
    logger.debug('tags.controller.create.start')
    const uid = await this.tagService.save(this.modelConstructor.constructPureObject(request))

    response.status(201).json({ uid })
    logger.debug('tags.controller.create.done')
  }

  public update = async (request: Request, response: Response): Promise<void> => {
    logger.debug('tags.controller.update.start')

    await this.tagService.update(this.modelConstructor.constructPureObject(request))

    response.status(204).send()
    logger.debug('tags.controller.update.done')
  }

  public delete = async (request: Request, response: Response): Promise<void> => {
    logger.debug('tags.controller.delete.start')

    await this.tagService.delete(request.params.uid)

    response.status(204).send()
    logger.debug('tags.controller.delete.done')
  }
}
