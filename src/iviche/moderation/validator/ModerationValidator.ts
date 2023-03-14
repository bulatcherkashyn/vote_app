import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Moderation } from '../model/Moderation'
import { ModerationResolutionType } from '../model/ModerationResolutionType'

export class ModerationResolutionValidator implements Validator<Moderation> {
  private joiValidator = joi.object({
    uid: joi
      .string()
      .uuid()
      .required(),
    resolution: joi
      .string()
      .required()
      .valid(...Object.values(ModerationResolutionType)),
    concern: joi
      .string()
      .empty('')
      .when('resolution', { is: ModerationResolutionType.REJECTED, then: joi.required() }),
    moderatorUID: joi
      .string()
      .uuid()
      .required(),
    lockingCounter: joi
      .number()
      .min(0)
      .required(),
  })

  validate(modelObject: Moderation): ValidationResult {
    logger.debug('moderation.validate')

    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
