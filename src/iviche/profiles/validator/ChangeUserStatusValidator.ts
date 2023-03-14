import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { ChangeUserStatus } from '../models/ChangeUserStatus'

export class ChangeUserStatusValidator implements Validator<ChangeUserStatus> {
  private joiValidator = joi.object({
    userId: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: ChangeUserStatus): ValidationResult {
    logger.debug('profile.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
