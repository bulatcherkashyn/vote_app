import joi from '@hapi/joi'

import { TagUtility } from '../../common/utils/TagUtility'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Tag } from '../model/Tag'

export class TagValidator implements Validator<Tag> {
  private joiValidator = joi.object({
    uid: joi.string().uuid(),
    value: joi
      .string()
      .regex(TagUtility.CORRECT_TAG_PATTERN)
      .max(50)
      .required(),
  })
  validate(modelObject: Tag): ValidationResult {
    logger.debug('profile.tag')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
