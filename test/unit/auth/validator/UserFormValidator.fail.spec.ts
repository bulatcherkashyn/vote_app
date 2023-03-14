import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { UserAuthForm } from '../../../../src/iviche/security/auth/models/UserAuthForm'
import { UserAuthFormValidator } from '../../../../src/iviche/security/auth/validator/UserAuthFormValidator'

const userAuthFormValidator = new UserAuthFormValidator()

describe('Fail tests of UserFrom validator. Common', () => {
  test('UserAuthForm. incorrect username. username is not email', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'super.test.username',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username is incorrect email', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@gmail.com@test',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property

    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username with incorrect email domain', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@q.q',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username is empty', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: '',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" is not allowed to be empty',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('UserAuthForm. incorrect username. username field is missing', () => {
    // GIVEN incorrect user data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correctUserFormData: any = {
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" is required',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('UserAuthForm. incorrect username. username is not email', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'super.test.username',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username is incorrect email', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@gmail.com@test',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username with incorrect email domain', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: 'test@q.q',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" must be a valid email',
      source: 'username',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('UserAuthForm. incorrect username. username is empty', () => {
    // GIVEN incorrect user data
    const correctUserFormData: UserAuthForm = {
      username: '',
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" is not allowed to be empty',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('UserAuthForm. incorrect username. username field is missing', () => {
    // GIVEN incorrect user data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correctUserFormData: any = {
      password: 'Dewais123!',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be true
    expect(result.hasError).toBeTruthy()
    // AND errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"username" is required',
      source: 'username',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('UserAuthForm. incorrect password. password field is missing', () => {
    // GIVEN incorrect user data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const correctUserFormData: any = {
      username: 'test@gmail.com',
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

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
