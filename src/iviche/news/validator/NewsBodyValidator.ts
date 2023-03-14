import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { NewsBody } from '../model/NewsBody'

export class NewsBodyValidator implements Validator<NewsBody> {
  private joiValidator = joi.object({
    uid: joi.string().uuid(),
    language: joi
      .string()
      .max(2)
      .required(),
    title: joi.string().required(),
    shortDescription: joi.string().required(),
    body: joi.string().required(),
    newsUID: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: NewsBody): ValidationResult {
    logger.debug('newsbody.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
