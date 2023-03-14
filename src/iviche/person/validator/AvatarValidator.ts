import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Avatar } from '../model/Avatar'

export class AvatarValidator implements Validator<Avatar> {
  public joiValidator = joi.object({
    avatar: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: Avatar): ValidationResult {
    logger.debug('avatar.validate')

    const result = adaptValidationResult(this.joiValidator.validate(modelObject))

    return result
  }
}
