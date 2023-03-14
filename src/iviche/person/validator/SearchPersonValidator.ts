import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { SearchedPerson } from '../model/SearchedPerson'

export class SearchPersonValidator implements Validator<SearchedPerson> {
  public personValidator = joi
    .object({
      uid: joi.string().uuid(),
      email: joi
        .string()
        .email()
        .max(255),
    })
    .xor('uid', 'email')

  validate(modelObject: SearchedPerson): ValidationResult {
    logger.debug('search-person.validate')
    return adaptValidationResult(this.personValidator.validate(modelObject))
  }
}
