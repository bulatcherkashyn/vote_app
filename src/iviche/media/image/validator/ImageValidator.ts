import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../../common/validators/Validator'
import { logger } from '../../../logger/LoggerFactory'
import { Image, ImageEntity } from '../model/Image'

export class ImageValidator implements Validator<Image> {
  private joiValidator = joi.object({
    isPublic: joi
      .boolean()
      .label('public')
      .error(errors => {
        errors[0].path[0] = 'public'
        return errors
      }),
    entity: joi.string().valid(...Object.values(ImageEntity)),
  })

  validate(modelObject: Image): ValidationResult {
    logger.debug('image.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
