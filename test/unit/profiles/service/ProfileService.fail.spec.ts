import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { EmailService } from '../../../../src/iviche/mailer/EmailService'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { Person } from '../../../../src/iviche/person/model/Person'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { ProfileDAOImpl } from '../../../../src/iviche/profiles/db/ProfileDAOImpl'
import { ProfileServiceImpl } from '../../../../src/iviche/profiles/services/ProfileServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { AuthProviderImpl } from '../../../../src/iviche/security/auth/services/AuthProviderImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDAOImpl } from '../../../../src/iviche/users/db/UserDAOImpl'
import { UserDetailsDAOImpl } from '../../../../src/iviche/users/db/UserDetailsDAOImpl'
import { UserServiceImpl } from '../../../../src/iviche/users/services/UserServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { PhoneServiceMock } from './ProfileTestHelper'

const mockedNotifyService = new PhoneServiceMock()
const MockEmailService: jest.Mock<EmailService> = jest.fn().mockImplementation(() => {
  return {
    sendConfirmEmailCodeIfNeeded: jest.fn(),
  }
})

const MockTelegramBotService: jest.Mock<TelegramBotServiceImpl> = jest
  .fn()
  .mockImplementation(() => {
    return {
      notifyModerators: jest.fn(),
    }
  })

const knexTracker = new KnexTestTracker()
const profileService = new ProfileServiceImpl(
  new ProfileDAOImpl(),
  new UserDAOImpl(),
  new PersonDAOImpl(),
  new UserDetailsDAOImpl(),
  new MockEmailService(),
  new UserServiceImpl(new UserDAOImpl(), knexTracker.getTestConnection()),
  knexTracker.getTestConnection(),
  mockedNotifyService,
  new ModerationDAOImpl(new PollDAOImpl(), MockTelegramBotService()),
  new AuthProviderImpl(),
)

describe('Profile service implementation', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('FAIL. Update person by Username. Not Found', async () => {
    // GIVEN Username
    const username = 'testtesttest@test.com'
    // AND person to run update
    const updatePerson: Person = {
      isLegalPerson: true,
      firstName: 'firstName1',
      middleName: 'middleName1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      legalName: 'legalName1',
      shortName: 'shortName1',
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      oneLine`
        update "person"
        set
          "isLegalPerson" = $1,
          "firstName" = $2,
          "middleName" = $3,
          "lastName" = $4,
          "jobTitle" = $5,
          "legalName" = $6,
          "shortName" = $7
        where "uid" in
          (select "personUID" from "users" where "username" = $8 limit $9)`,
      0,
      false,
    )

    try {
      // WHEN person is saved
      await profileService.updatePersonByUsername(username, updatePerson, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(404)
      expect(e.message).toBe('Not found [person] entity for update-by-username')
    }
  })

  test('FAIL. Update person by Email. 2 rows was updated', async () => {
    // GIVEN Username
    const username = 'test@test.com'
    // AND person to run update
    const updatePerson: Person = {
      isLegalPerson: true,
      firstName: 'firstName1',
      middleName: 'middleName1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      legalName: 'legalName1',
      shortName: 'shortName1',
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      oneLine`
        update "person"
        set
          "isLegalPerson" = $1,
          "firstName" = $2,
          "middleName" = $3,
          "lastName" = $4,
          "jobTitle" = $5,
          "legalName" = $6,
          "shortName" = $7
        where "uid" in
          (select "personUID" from "users" where "username" = $8 limit $9)`,
      2,
      false,
    )

    try {
      // WHEN person is saved
      await profileService.updatePersonByUsername(username, updatePerson, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(400)
      expect(e.message).toBe('update-by-username for entity [person] failed')
    }
  })

  test('FAIL. Update password GrandAccessACS. NOT FOUND', async () => {
    // GIVEN username, password, new password, userUID
    const username = 'test@test.com'
    const newPassword = 'new_pass'

    // AND expected query method
    knexTracker.mockSQL(
      [
        oneLine`update "users"
        set
          "password" = $1
        where
          "username" = $2`,
      ],
      [0],
      false,
    )

    try {
      // WHEN update password
      await profileService.updatePassword(username, newPassword, new GrandAccessACS())
    } catch (e) {
      // THEN got error
      expect(e.httpCode).toBe(404)
      expect(e.message).toBe('Not found [user] entity for update-password')
    }
  })

  test('FAIL. Update password GrandAccessACS. UNNOWN', async () => {
    // GIVEN username, password, new password, userUID
    const username = 'test@test.com'
    const newPassword = 'new_pass'

    // AND expected query method
    knexTracker.mockSQL(
      [
        oneLine`update "users"
        set
          "password" = $1
        where
          "username" = $2`,
      ],
      [2],
      false,
    )

    try {
      // WHEN update password
      await profileService.updatePassword(username, newPassword, new GrandAccessACS())
    } catch (e) {
      // THEN got error
      expect(e.httpCode).toBe(400)
      expect(e.message).toBe('update-password for entity [user] failed')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
