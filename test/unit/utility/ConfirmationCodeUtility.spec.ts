import { ConfirmationCodeUtility } from '../../../src/iviche/common/ConfirmationCodeUtility'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { Profile } from '../../../src/iviche/profiles/models/Profile'

describe('ConfirmationCodeUtility. Common', () => {
  test('addEmailConfirmationCode. successfully', async () => {
    // GIVEN correct profile data
    const profile: Profile = {
      person: {
        email: 'pericles@iviche.com',
      },
      user: {
        username: 'pericles@iviche.com',
        password: 'Dewais123!',
        role: UserRole.PRIVATE,
      },
      details: {},
    }

    // WHEN add confirmation code to user profile
    const profileWithConfirmationCode = ConfirmationCodeUtility.addEmailConfirmationCode(profile)

    // THEN we expect what confirm code have length 128
    expect(profileWithConfirmationCode.details.emailConfirmationCode).toHaveLength(128)
    expect(profileWithConfirmationCode.details.emailConfirmationCodeCreatedAt).not.toBeUndefined()
  })
})
