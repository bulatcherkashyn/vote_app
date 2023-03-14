import 'reflect-metadata'

import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { Tag } from '../../../../src/iviche/tag/model/Tag'
import { TagValidator } from '../../../../src/iviche/tag/validator/TagValidator'
import { createRandomString } from '../../common/TestUtilities'

const validator = new TagValidator()

describe('Tag validator. Fail', () => {
  test('Incorrect value', () => {
    // GIVEN inccorrect tag
    const tag: Tag = {
      value: '22:?!TestTag ',
    }

    // WHEN validate
    const result = validator.validate(tag)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: `"value" with value "22:?!TestTag " fails to match the required pattern: /^[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+(\\s[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+)*$/`,
      source: 'value',
      code: ValidationErrorCodes.UNKNOWN_VALIDATION_ERROR,
    })
  })
  test('Value is empty', () => {
    // GIVEN inccorrect  tag
    const tag: Tag = {
      value: '',
    }

    // WHEN validate
    const result = validator.validate(tag)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"value" is not allowed to be empty',
      source: 'value',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('Value is too long', () => {
    // GIVEN inccorrect  tag
    const tag: Tag = {
      value: createRandomString(51),
    }

    // WHEN validate
    const result = validator.validate(tag)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"value" length must be less than or equal to 50 characters long',
      source: 'value',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })
})
