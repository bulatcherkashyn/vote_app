import joi from '@hapi/joi'

import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../../src/iviche/common/validators/Validator'
import { ValidationErrorCodes } from '../../../src/iviche/error/DetailErrorCodes'
import { passwordValidator } from '../../../src/iviche/users/validator/PasswordValidator'
import { createRandomString } from '../common/TestUtilities'

interface TestPasswordValidator {
  password?: string
}

class TestValidator implements Validator<TestPasswordValidator> {
  public joiValidator = joi.object({
    password: passwordValidator.required(),
  })

  validate(modelObject: TestPasswordValidator): ValidationResult {
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}

const testValidator = new TestValidator()

describe('Passwordvalidator', () => {
  test('Successful password validate', () => {
    // GIVEN correct password object for own validator
    const password: TestPasswordValidator = {
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('Incorrect password. password is too short', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: 'Test1!',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should be at least 8 characters long',
      source: 'password',
      code: ValidationErrorCodes.FIELD_LENGTH_MIN_VALIDATION_ERROR,
    })
  })

  test('Incorrect password. password is too long', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: `TEST1!${createRandomString(128)}`,
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should not be longer than 128 characters',
      source: 'password',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  // NOTE: temporary disabled
  test.skip('Incorrect password. password without lowerCase letter', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: 'DEWAIS123!',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should contain at least 1 lower-cased letter',
      source: 'password',
      code: ValidationErrorCodes.PASSWORD_LOWER_CASE_CHARACTER_VALIDATION_ERROR,
    })
  })

  // NOTE: temporary disabled
  test.skip('Incorrect password. password without upperCase letter', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: 'dewais123!',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should contain at least 1 upper-cased letter',
      source: 'password',
      code: ValidationErrorCodes.PASSWORD_UPPER_CASE_CHARACTER_VALIDATION_ERROR,
    })
  })

  // NOTE: temporary disabled
  test.skip('Incorrect password. password without numeric character', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: 'DewaisTest!',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should contain at least 1 number',
      source: 'password',
      code: ValidationErrorCodes.PASSWORD_NUMERIC_CHARACTER_VALIDATION_ERROR,
    })
  })

  // NOTE: temporary disabled
  test.skip('Incorrect password. password without symbol character', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: 'DewaisTest1',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: 'password should contain at least 1 symbol',
      source: 'password',
      code: ValidationErrorCodes.PASSWORD_SYMBOL_CHARACTER_VALIDATION_ERROR,
    })
  })

  test('Incorrect password. password field is empty', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {
      password: '',
    }

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"password" is not allowed to be empty',
      source: 'password',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('Incorrect password. password field is missing', () => {
    // GIVEN incorrect password object for own validator
    const password: TestPasswordValidator = {}

    // WHEN data will be validate
    const result = testValidator.validate(password)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"password" is required',
      source: 'password',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })
})
