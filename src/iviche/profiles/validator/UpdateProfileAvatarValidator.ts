import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { UpdateProfileAvatar } from '../models/UpdateProfileAvatar'

export class UpdateProfileAvatarValidator implements Validator<UpdateProfileAvatar> {
  private joiValidator = joi.object({
    username: joi
      .string()
      .min(3)
      .required(),

    avatar: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: UpdateProfileAvatar): ValidationResult {
    logger.debug('profile.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
