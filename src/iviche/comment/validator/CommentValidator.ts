import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Comment } from '../model/Comment'
import { CommentEntity } from '../model/CommentEntity'

export class CommentValidator implements Validator<Comment> {
  private joiValidator = joi.object({
    entityType: joi
      .string()
      .required()
      .valid(...Object.values(CommentEntity)),
    entityUID: joi
      .string()
      .uuid()
      .required(),
    parentUID: joi.string().uuid(),
    text: joi
      .string()
      .max(1023)
      .required(),
    authorUID: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: Comment): ValidationResult {
    logger.debug('comment.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
