import 'reflect-metadata'

import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { Moderation } from '../../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolutionValidator } from '../../../../src/iviche/moderation/validator/ModerationValidator'
import { moderatorData } from '../../../i9n/common/TestUtilities'

const validator = new ModerationResolutionValidator()

describe('Moderation validator. Fail', () => {
  test('Invalid uid', () => {
    // GIVEN incorrect moderation case
    const moderationCase = {
      uid: '00000000000000000001',
      moderatorUID: moderatorData.uid,
      resolution: ModerationResolutionType.PENDING,
      concern: 'Test',
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN has errors
    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toStrictEqual({
      message: '"uid" must be a valid GUID',
      source: 'uid',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })
  test('Empty uid', () => {
    // GIVEN incorrect moderation case
    const moderationCase = {
      uid: '',
      moderatorUID: moderatorData.uid,
      resolution: ModerationResolutionType.PENDING,
      concern: 'Test',
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN has errors
    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toStrictEqual({
      message: '"uid" is not allowed to be empty',
      source: 'uid',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })
  test('Invalid resolution', () => {
    // GIVEN incorrect moderation case
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      moderatorUID: moderatorData.uid,
      resolution: 'TEST',
      concern: 'Test',
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN has errors
    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toStrictEqual({
      message: '"resolution" must be one of [PENDING, APPROVED, REJECTED]',
      source: 'resolution',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })
  test('Empty concern when resilution is REJECTED', () => {
    // GIVEN incorrect moderation case
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      moderatorUID: moderatorData.uid,
      resolution: ModerationResolutionType.REJECTED,
      concern: '',
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN has errors
    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toStrictEqual({
      message: '"concern" is required',
      source: 'concern',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })
})
