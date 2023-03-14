import 'reflect-metadata'

import { UserAuthForm } from '../../../../src/iviche/security/auth/models/UserAuthForm'
import { UserAuthFormValidator } from '../../../../src/iviche/security/auth/validator/UserAuthFormValidator'
import { primeAdminData } from '../../../i9n/common/TestUtilities'

const userAuthFormValidator = new UserAuthFormValidator()

describe('Successfully tests of UserForm validator', () => {
  test('UserAuthForm. valid username and password', () => {
    // GIVEN correct user data
    const correctUserFormData: UserAuthForm = {
      username: primeAdminData.username,
      password: primeAdminData.password,
    }

    // WHEN data will be validate
    const result = userAuthFormValidator.validate(correctUserFormData)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })
})
