import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Issue } from '../model/Issue'
import { IssueResolution } from '../model/IssueResolution'

export class IssueResolutionValidator implements Validator<Issue> {
  private joiValidator = joi.object({
    uid: joi
      .string()
      .uuid()
      .required(),
    resolution: joi
      .string()
      .required()
      .valid(...Object.values(IssueResolution)),
    comment: joi.string().empty(''),
    moderatorUID: joi
      .string()
      .uuid()
      .required(),
  })

  validate(modelObject: Issue): ValidationResult {
    logger.debug('issue.resolution.validate')

    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
