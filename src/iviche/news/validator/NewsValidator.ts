import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { News } from '../model/News'

export class NewsValidator implements Validator<News> {
  private joiValidator = joi.object({
    uid: joi.string().uuid(),
    alternativeLink: joi.string().required(),
    theme: joi.string().required(),
    status: joi.string().required(),
    createdAt: joi.date(),
    publishedAt: joi.date(),
    tags: joi.object().required(),
    authorUID: joi.string().required(),
    pollUID: joi.string().required(),
  })

  validate(modelObject: News): ValidationResult {
    logger.debug('news.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
