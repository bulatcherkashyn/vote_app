import 'reflect-metadata'

import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { IssueQueryListForValidator } from '../model/IssueQueryList'
import { IssueResolution } from '../model/IssueResolution'
import { IssueType } from '../model/IssueType'

export class IssueQueryListValidator implements Validator<IssueQueryListForValidator> {
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

    type: joi.array().items(...Object.values(IssueType)),
    resolution: joi.array().items(...Object.values(IssueResolution)),
  })

  validate(modelObject: IssueQueryListForValidator): ValidationResult {
    logger.debug('issue-query-list.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
