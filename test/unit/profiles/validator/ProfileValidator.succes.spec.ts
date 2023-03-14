import { UserRole } from '../../../../src/iviche/common/UserRole'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { ProfileValidator } from '../../../../src/iviche/profiles/validator/ProfileValidator'
const validator = new ProfileValidator()

describe('Successfully tests of Profile validator', () => {
  test('Create profile. role User (role: legal)', async () => {
    // GIVEN correct profile data for validator
    const prof: Profile = {
      user: { username: 'test@test.com', password: 'Dewais123!', role: UserRole.LEGAL },
      person: {
        firstName: 'Petrik',
        lastName: 'Pyatochkin',
        isLegalPerson: false,
        phone: '+380661231212#00002',
        email: 'test@test.com',
      },
      details: {},
    }

    // WHEN validate
    const result = validator.validate(prof)

    // THEN no error
    expect(result.hasError).toBeFalsy()
  })
})
