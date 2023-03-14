import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { PollWatchBody } from '../models/PollWatchBody'

export class PollWatchBodyValidator implements Validator<PollWatchBody> {
  private joiValidator = joi.object({
    pollUID: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: PollWatchBody): ValidationResult {
    logger.debug('pollWatchBody.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
