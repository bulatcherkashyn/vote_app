import 'reflect-metadata'

import joi from '@hapi/joi'
import { container } from 'tsyringe'

import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { Theme } from '../../common/Theme'
import { DateUtility } from '../../common/utils/DateUtility'
import { TagUtility } from '../../common/utils/TagUtility'
import {
  adaptValidationResult,
  validateionResultNoErrors,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { CompetencyTagService } from '../../competencyTag/service/CompetencyTagService'
import { ValidationErrorCodes } from '../../error/DetailErrorCodes'
import { logger } from '../../logger/LoggerFactory'
import { AgeGroup } from '../models/AgeGroup'
import { PollForm } from '../models/PollForm'
import { PollType } from '../models/PollType'
import { PollAnswerValidator } from './PollAnswerValidator'

export class PollValidator implements Validator<PollForm> {
  private answer = new PollAnswerValidator().answerValidator

  private competencyTagService = container.resolve<CompetencyTagService>('CompetencyTagService')

  private joiValidator = joi.object({
    uid: joi.string().uuid(),
    theme: joi
      .string()
      .valid(...Object.values(Theme))
      .required(),
    complexWorkflow: joi.boolean(),
    anonymous: joi.boolean(),
    draft: joi.boolean().default(false), // this field sets by constructor, need for rules
    title: joi
      .string()
      .max(255)
      .required(),
    body: joi
      .string()
      .max(20000)
      .when('draft', { is: joi.boolean().invalid(true), then: joi.required() })
      .when('draft', { is: joi.boolean().invalid(false), then: joi.string().empty('') }),
    discussionStartAt: joi
      .date()
      .iso()
      .when('complexWorkflow', {
        is: true,
        then: joi
          .date()
          .min(DateUtility.today())
          .required(),
      })
      .when('complexWorkflow', {
        is: false,
        then: joi.date().forbidden(),
      }),
    votingStartAt: joi
      .date()
      .iso()
      .min(DateUtility.today())
      .required()
      .when('complexWorkflow', {
        is: true,
        then: joi.date().greater(joi.ref('discussionStartAt')),
      }),
    votingEndAt: joi
      .date()
      .iso()
      .required()
      .when('complexWorkflow', {
        is: true,
        then: joi.date().greater(joi.ref('votingStartAt')),
      })
      .when('complexWorkflow', {
        is: false,
        then: joi.when('pollType', { is: PollType.RATING_MONITOR, then: joi.valid(null) }),
      }),
    tags: joi
      .array()
      .items(
        joi
          .string()
          .max(50)
          .regex(TagUtility.CORRECT_TAG_PATTERN),
      )
      .max(10),
    competencyTags: joi
      .array()
      .items(...this.competencyTagService.getFlattenCompetencyTagsList())
      .max(10),
    taAgeGroups: joi
      .array()
      .items(...Object.values(AgeGroup))
      .min(1)
      .required(),
    taGenders: joi
      .array()
      .items(...Object.keys(Gender))
      .invalid(Gender.UNSET)
      .min(1)
      .required(),
    taSocialStatuses: joi
      .array()
      .items(joi.string().valid(...Object.keys(SocialStatus)))
      .invalid(SocialStatus.UNKNOWN)
      .min(1)
      .required(),
    taAddressRegion: joi
      .string()
      .valid(...Object.values(Region))
      .invalid(Region.UNKNOWN)
      .required(),
    taAddressDistrict: joi
      .string()
      .empty('')
      .max(64),
    taAddressTown: joi
      .string()
      .empty('')
      .max(64),
    authorUID: joi.string().uuid(),
    answers: joi
      .array()
      .items(this.answer)
      .when('draft', {
        is: joi.boolean().invalid(true),
        then: joi
          .array()
          .min(2)
          .required(),
      }),
    pollType: joi.string().valid(...Object.values(PollType)),
    image: joi.string().uuid(),
  })

  private checkTimeOfDate(date: Date): boolean {
    return (
      date.getUTCHours() !== 0 ||
      date.getMinutes() !== 0 ||
      date.getSeconds() !== 0 ||
      date.getMilliseconds() !== 0
    )
  }

  private checkDatesComplexWorkflowFalse(obj: PollForm): ValidationResult {
    const { votingStartAt, votingEndAt, pollType } = obj
    const votingStartAtDate = DateUtility.fromISO(votingStartAt)
    if (this.checkTimeOfDate(votingStartAtDate)) {
      return {
        hasError: true,
        errorDefinition: {
          code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
          message: 'Incorrect format of date',
          source: 'votingStartAt',
        },
      }
    }

    if (
      (DateUtility.getDateDiff(votingStartAtDate, DateUtility.today(), ['days']).days as number) > 0
    ) {
      return {
        hasError: true,
        errorDefinition: {
          code: ValidationErrorCodes.FIELD_DATA_MIN_VALIDATION_ERROR,
          message: 'Incorrect date start must be latter',
          source: 'votingStartAt',
        },
      }
    }

    if (pollType === PollType.RATING_MONITOR) {
      if (votingEndAt !== null) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Incorrect format of date',
            source: 'votingEndAt',
          },
        }
      } else {
        return validateionResultNoErrors
      }
    }

    const votingEndAtDate = DateUtility.fromISO(votingEndAt)

    if (this.checkTimeOfDate(votingEndAtDate)) {
      return {
        hasError: true,
        errorDefinition: {
          code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
          message: 'Incorrect format of date',
          source: 'votingEndAt',
        },
      }
    }

    const diffVoites = DateUtility.getDateDiff(votingStartAtDate, votingEndAtDate, ['days']).days

    if (diffVoites && (diffVoites < 1 || diffVoites > 30)) {
      return {
        hasError: true,
        errorDefinition: {
          code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
          message: 'VotingEndAt must be latter 7-30 days',
          source: 'votingEndAt',
        },
      }
    }

    return validateionResultNoErrors
  }

  private checkDatesComplexWorkflowTrue(obj: PollForm): ValidationResult {
    const { votingEndAt, votingStartAt, discussionStartAt } = obj

    if (discussionStartAt) {
      const discussion = DateUtility.fromISO(discussionStartAt)
      if (this.checkTimeOfDate(discussion)) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Incorrect format of date',
            source: 'discussionStartAt',
          },
        }
      }

      if ((DateUtility.getDateDiff(discussion, DateUtility.today(), ['days']).days as number) > 0) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_DATA_MIN_VALIDATION_ERROR,
            message: 'Incorrect date start must be latter',
            source: 'discussionStartAt',
          },
        }
      }

      const votingStart = DateUtility.fromISO(votingStartAt)

      if (this.checkTimeOfDate(votingStart)) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Incorrect format of date',
            source: 'votingStartAt',
          },
        }
      }

      const diffVotingStart = DateUtility.getDateDiff(discussion, votingStart, ['days']).days

      if (diffVotingStart && (diffVotingStart < 1 || diffVotingStart > 30)) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Voting start at must be 1-30 days after start discussion',
            source: 'votingStartAt',
          },
        }
      }

      const votingEnd = DateUtility.fromISO(votingEndAt)

      if (this.checkTimeOfDate(votingEnd)) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Incorrect format of date',
            source: 'votingEndAt',
          },
        }
      }

      const diffVotings = DateUtility.getDateDiff(votingStart, votingEnd, ['days']).days

      if (diffVotings && (diffVotings < 1 || diffVotings > 30)) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Voiting round must be 1-30 days',
            source: 'votingEndAt',
          },
        }
      }

      if (diffVotingStart && diffVotings && diffVotingStart * 3 < diffVotings) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Discussion round must be at least 1/3 of voting,',
            source: 'votingEndAt',
          },
        }
      }
    }

    return validateionResultNoErrors
  }

  private checkDates(obj: PollForm): ValidationResult {
    if (obj.complexWorkflow) {
      return this.checkDatesComplexWorkflowTrue(obj)
    }

    return this.checkDatesComplexWorkflowFalse(obj)
  }

  private checkSortOfAgeGroups(ages: Array<string>): ValidationResult {
    ages.forEach((age, index) => {
      if (
        (age === AgeGroup.TWENTY && age[index + 1] && age[index + 1] !== AgeGroup.TWENTY_FIVE) ||
        (age === AgeGroup.TWENTY_FIVE &&
          age[index + 1] &&
          age[index + 1] !== AgeGroup.THIRTY_FIVE) ||
        (age === AgeGroup.THIRTY_FIVE &&
          age[index + 1] &&
          age[index + 1] !== AgeGroup.FORTY_FIVE) ||
        (age === AgeGroup.FORTY_FIVE && age[index + 1] && age[index + 1] !== AgeGroup.FIFTY_FIVE) ||
        (age === AgeGroup.FIFTY_FIVE &&
          age[index + 1] &&
          age[index + 1] !== AgeGroup.FIFTY_SIX_PLUS) ||
        (age === AgeGroup.FIFTY_SIX_PLUS && !age[index + 1])
      ) {
      }
      return {
        hasError: true,
        errorDefinition: {
          code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
          message: 'Age groups must be sorted',
          source: 'poll.ageGroup',
        },
      }
    })

    return validateionResultNoErrors
  }

  validate(modelObject: PollForm): ValidationResult {
    logger.debug('poll.validate')
    const valid = adaptValidationResult(this.joiValidator.validate(modelObject))

    if (!valid.hasError && modelObject.answers) {
      const incorrectIndex = modelObject.answers.filter((answer, index) => answer.index !== index)
      if (incorrectIndex.length) {
        return {
          hasError: true,
          errorDefinition: {
            code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
            message: 'Answers index not match the pattern ',
            source: 'poll.answers.index',
          },
        }
      }

      const checkDates = this.checkDates(modelObject)
      if (checkDates.hasError) {
        return checkDates
      }
      return this.checkSortOfAgeGroups(modelObject.taAgeGroups)
    }

    return valid
  }
}
