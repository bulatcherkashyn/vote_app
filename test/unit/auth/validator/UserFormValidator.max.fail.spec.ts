import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { UserAuthForm } from '../../../../src/iviche/security/auth/models/UserAuthForm'
import { UserAuthFormValidator } from '../../../../src/iviche/security/auth/validator/UserAuthFormValidator'
import { createRandomString } from '../../common/TestUtilities'

const userAuthFormValidator = new UserAuthFormValidator()

describe('Fail tests of UserFrom validator. Max | min value', () => {
  test('UserAuthForm. incorrect password. password is too short', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@gmail.com',
      password: 'Test1!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be false
    expect(result.hasError).toBeFalsy()
  })

  test('UserAuthForm. incorrect password. password is too long', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@gmail.com',
      password: `TEST1!${createRandomString(128)}`,
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition.message).toEqual(
      '"password" length must be less than or equal to 128 characters long',
    )
    expect(result.errorDefinition.source).toBe('password')
    expect(result.errorDefinition.code).toBe(ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR)
  })
})
