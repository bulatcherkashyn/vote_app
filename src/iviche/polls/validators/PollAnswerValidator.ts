import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { PollAnswerForm } from '../models/PollAnswerForm'

export class PollAnswerValidator implements Validator<PollAnswerForm> {
  public answerValidator = joi.object({
    uid: joi.string().uuid(),
    basic: joi.boolean(),
    index: joi.number(),
    title: joi
      .string()
      .max(255)
      .required(),
  })

  validate(modelObject: PollAnswerForm): ValidationResult {
    logger.debug('poll.validate')
    return adaptValidationResult(this.answerValidator.validate(modelObject))
  }
}
