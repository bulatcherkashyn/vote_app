import 'reflect-metadata'

import joi from '@hapi/joi'
import { container } from 'tsyringe'

import { Theme } from '../../common/Theme'
import { TagUtility } from '../../common/utils/TagUtility'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { CompetencyTagService } from '../../competencyTag/service/CompetencyTagService'
import { logger } from '../../logger/LoggerFactory'
import { PollOrderBy } from '../models/PollOrderBy'
import { PollQueryListForValidator } from '../models/PollQueryList'
import { PollStatus } from '../models/PollStatus'
import { PollType } from '../models/PollType'

export class PollQueryListValidator implements Validator<PollQueryListForValidator> {
  private competencyTagService = container.resolve<CompetencyTagService>('CompetencyTagService')

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
    theme: joi.string().valid(...Object.values(Theme)),
    title: joi.string().empty(''),

    tags: joi.array().items(
      joi
        .string()
        .max(255)
        .regex(TagUtility.CORRECT_TAG_PATTERN),
    ),

    competencyTags: joi.array().items(...this.competencyTagService.getFlattenCompetencyTagsList()),
    taAddressRegion: joi.string().empty(''),
    status: joi.array().items(...Object.values(PollStatus)),
    pollType: joi.string().valid(...Object.values(PollType)),

    publishedAtStart: joi
      .date()
      .iso()
      .when('publishedAtEnd', {
        is: joi.exist(),
        then: joi.date().less(joi.ref('publishedAtEnd')),
      }),

    publishedAtEnd: joi.date().iso(),

    authorUID: joi.string().uuid(),

    orderBy: joi.string().valid(...Object.values(PollOrderBy)),
  })

  validate(modelObject: PollQueryListForValidator): ValidationResult {
    logger.debug('poll-query-list.validate')
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
