import 'reflect-metadata'

import { Comment } from '../../../../src/iviche/comment/model/Comment'
import { CommentEntity } from '../../../../src/iviche/comment/model/CommentEntity'
import { CommentValidator } from '../../../../src/iviche/comment/validator/CommentValidator'
import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { testNewsList } from '../../../database/seeds/TestNewsList'
import { regularUserData } from '../../../i9n/common/TestUtilities'

const validator = new CommentValidator()

describe('Comment validator. FAILED', () => {
  test('Unavailable entityType', () => {
    // GIVEN incorrect data
    const incorrectData = ({
      entityType: 'person',
      entityUID: testNewsList[1].uid,
      text: 'Please rewrite me to NEO4j',
      authorUID: regularUserData.uid,
    } as any) as Comment // eslint-disable-line @typescript-eslint/no-explicit-any

    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"entityType" must be one of [news, poll]',
      source: 'entityType',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('entityUID is not uid', () => {
    // GIVEN incorrect data
    const incorrectData = {
      entityType: CommentEntity.NEWS,
      entityUID: 'non-uid',
    }
    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"entityUID" must be a valid GUID',
      source: 'entityUID',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('parentUID is not uid', () => {
    // GIVEN incorrect data
    const incorrectData: Comment = {
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      parentUID: 'non-uid',
    }
    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"parentUID" must be a valid GUID',
      source: 'parentUID',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('text is not exist', () => {
    // GIVEN incorrect data
    const incorrectData: Comment = {
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      authorUID: regularUserData.uid,
    }
    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"text" is required',
      source: 'text',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('text is not string', () => {
    // GIVEN incorrect data
    const incorrectData: Comment = ({
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      text: 111,
      authorUID: regularUserData.uid,
    } as any) as Comment // eslint-disable-line @typescript-eslint/no-explicit-any
    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"text" must be a string',
      source: 'text',
      code: ValidationErrorCodes.FIELD_DATA_TYPE_VALIDATION_ERROR,
    })
  })

  test('authorUID is not exist', () => {
    // GIVEN incorrect data
    const incorrectData: Comment = {
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      text: 'Although it is good too',
    }
    // WHEN validate object
    const result = validator.validate(incorrectData)

    // THEN got error
    expect(result.hasError).toBe(true)
    expect(result.errorDefinition).toStrictEqual({
      message: '"authorUID" is required',
      source: 'authorUID',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })
})
