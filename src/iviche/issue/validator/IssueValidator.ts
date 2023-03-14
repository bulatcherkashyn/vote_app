import joi from '@hapi/joi'

import { UserRole } from '../../common/UserRole'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { logger } from '../../logger/LoggerFactory'
import { Issue } from '../model/Issue'
import { IssueReferenceType } from '../model/IssueReferenceType'
import { IssueResolution } from '../model/IssueResolution'
import { IssueType } from '../model/IssueType'

export class IssueValidator implements Validator<Issue> {
  private joiValidator = joi.object({
    type: joi
      .string()
      .required()
      .valid(...Object.values(IssueType)),
    body: joi
      .string()
      .required()
      .max(4000),
    userUID: joi
      .alternatives(joi.string().uuid(), joi.string().valid(UserRole.ANONYMOUS))
      .required(),
    issuerEmail: joi
      .string()
      .email()
      .when('userUID', { is: UserRole.ANONYMOUS, then: joi.required() }),
    reference: joi.string().uuid(),
    referenceObjectType: joi.string().valid(...Object.values(IssueReferenceType)),
    resolution: joi
      .string()
      .required()
      .valid(IssueResolution.PENDING),
  })

  validate(modelObject: Issue): ValidationResult {
    logger.debug('issue.validate')

    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
