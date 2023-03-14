import joi from '@hapi/joi'

import { Region } from '../../common/Region'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'

export class DashboardMainValidator implements Validator<{ region: string }> {
  private joiValidator = joi.object({
    region: joi.string().valid(...Object.values(Region)),
  })

  validate(modelObject: { region: string }): ValidationResult {
    logger.debug('validator.dashboard')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
