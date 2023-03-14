import { UserRole } from '../../../../src/iviche/common/UserRole'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { ProfileValidator } from '../../../../src/iviche/profiles/validator/ProfileValidator'
const validator = new ProfileValidator()

describe('Fail tests of Profile validator', () => {
  test('Create profile. Incorrect user role (incorrectrole)', async () => {
    // GIVEN incorrect profile data (not existing user role)
    const prof: Profile = {
      user: {
        username: 'test@test.com',
        password: 'LegalPersonUnusablePassword1!',
        role: 'incorrectrole' as UserRole,
      },
      person: {
        isLegalPerson: true,
        isPublicPerson: true,
        email: 'test@test.com',
        legalName: 'bla',
        shortName: 'bla',
        phone: '+380440001122#001',
        birthdayAt: new Date('01.01.2000'),
      },
      details: {
        notifyEmail: true,
        notifySMS: true,
        notifyTelegram: true,
        notifyViber: true,
        linkFacebook: 'LinkFacebook',
        linkGoogle: 'LinkGoogle',
        linkSite: 'RandomSite',
      },
    }

    // WHEN validate
    const result = validator.validate(prof)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toStrictEqual({
      message: '"user.role" must be one of [JOURNALIST, MODERATOR, LEGAL]',
      source: 'user.role',
      code: 400003,
    })
  })
})
