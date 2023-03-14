import joi from '@hapi/joi'

import { TagUtility } from '../../common/utils/TagUtility'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { NewsQueryListForValidator } from '../model/NewsQueryList'
import { NewsSection } from '../model/NewsSection'
import { NewsTheme } from '../model/NewsTheme'

export class NewsQueryListValidator implements Validator<NewsQueryListForValidator> {
  private joiValidator = joi.object({
    offset: joi
      .number()
      .min(0)
      .required(),

    limit: joi
      .number()
      .greater(0)
      .max(1000)
      .required(),

    searchTerm: joi.string().min(3),
    section: joi.string().valid(...Object.values(NewsSection)),
    theme: joi.string().valid(...Object.values(NewsTheme)),

    tags: joi.array().items(
      joi
        .string()
        .max(255)
        .regex(TagUtility.CORRECT_TAG_PATTERN),
    ),

    publishedAtStart: joi
      .date()
      .iso()
      .when('publishedAtEnd', {
        is: joi.exist(),
        then: joi.date().less(joi.ref('publishedAtEnd')),
      }),

    publishedAtEnd: joi.date().iso(),

    orderBy: joi.string(),

    hasPollLink: joi.boolean(),
  })

  validate(modelObject: NewsQueryListForValidator): ValidationResult {
    logger.debug('news-query-list.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
