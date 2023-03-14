import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { Language } from '../../../../src/iviche/common/Language'
import { UserRole } from '../../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { EmailService } from '../../../../src/iviche/mailer/EmailService'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { ProfileDAOImpl } from '../../../../src/iviche/profiles/db/ProfileDAOImpl'
import { ProfileDTO } from '../../../../src/iviche/profiles/dto/ProfileDTO'
import { Profile } from '../../../../src/iviche/profiles/models/Profile'
import { ProfileServiceImpl } from '../../../../src/iviche/profiles/services/ProfileServiceImpl'
import { EditOwnObjectACS } from '../../../../src/iviche/security/acs/strategies'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { AuthProviderImpl } from '../../../../src/iviche/security/auth/services/AuthProviderImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDAOImpl } from '../../../../src/iviche/users/db/UserDAOImpl'
import { UserDetailsDAOImpl } from '../../../../src/iviche/users/db/UserDetailsDAOImpl'
import { UserServiceImpl } from '../../../../src/iviche/users/services/UserServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import {
  listDtoProfiles,
  listProfiles,
  ownProfile,
  ownProfileDTO,
  PhoneServiceMock,
  profileDTO,
  singleProfile,
} from './ProfileTestHelper'

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

  test('create profile', async () => {
    // GIVEN new Profile data
    const createProfile: Profile = {
      user: {
        username: 'testmail@test.com',
        password: 'Dewais123!',
        role: UserRole.MODERATOR,
      },
      person: {
        isPublicPerson: true,
        email: 'testmail@test.com',
      },
      details: {
        emailConfirmationCode: 'test-sha512',
        emailConfirmationCodeCreatedAt: DateUtility.now(),
      },
    }

    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`select * from "person" where "email" = $1 and "deletedAt" is null limit $2`,

        oneLine`insert into "person"
            ("addressDistrict",
            "addressRegion",
            "addressTown",
            "bio",
            "birthdayAt",
            "createdAt",
            "email",
            "firstName",
            "gender",
            "isLegalPerson",
            "isPublicPerson",
            "jobTitle",
            "lastName",
            "legalName",
            "middleName",
            "phone",
            "shortName",
            "socialStatus",
            "tagline",
            "uid")
         values
             (DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             $1,
             $2,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             $3,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             DEFAULT,
             $4)`,

        oneLine`insert into "users"
            ("createdAt",
            "lastLoginAt",
            "password",
            "personUID",
            "role",
            "systemStatus",
            "uid",
            "username")
        values
            ($1,
            DEFAULT,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7)`,

        oneLine`insert into "user_details"
            ("appleId",
            "createdAt",
            "emailConfirmationCode",
            "emailConfirmationCodeCreatedAt",
            "emailConfirmed",
            "facebookId",
            "googleId",
            "linkApple",
            "linkFacebook",
            "linkGoogle",
            "linkSite",
            "newsPreferences",
            "notifyAboutNewPoll",
            "notifyEmail",
            "notifySMS",
            "notifyTelegram",
            "notifyViber",
            "passwordRestorationCode",
            "phoneConfirmationCode",
            "phoneConfirmed",
            "uid",
            "wpJournalistID")
        values
            (DEFAULT,
            $1,
            $2,
            $3,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            DEFAULT,
            $4,
            DEFAULT)`,
      ],
      [undefined, {}, {}, {}],
    )

    // WHEN created new Profile
    await profileService.create(createProfile, new GrandAccessACS())

    // THEN no error
  })

  test('get profile', async () => {
    // GIVEN dto profile

    // AND expected data
    const expected: Profile = {
      person: singleProfile.person,
      user: singleProfile.user,
      details: singleProfile.details,
    }

    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`select
            "users"."username" as "username",
            "users"."role" as "role",
            "users"."systemStatus" as "systemStatus",
            "person"."isLegalPerson" as "isLegalPerson",
            "person"."isPublicPerson" as "isPublicPerson",
            "person"."firstName" as "firstName",
            "person"."middleName" as "middleName",
            "person"."lastName" as "lastName",
            "person"."jobTitle" as "jobTitle",
            "person"."legalName" as "legalName",
            "person"."shortName" as "shortName",
            "person"."tagline" as "tagline",
            "person"."email" as "email",
            "person"."phone" as "phone",
            "person"."birthdayAt" as "birthdayAt",
            "person"."gender" as "gender",
            "person"."socialStatus" as "socialStatus",
            "person"."bio" as "bio",
            "person"."addressRegion" as "addressRegion",
            "person"."addressDistrict" as "addressDistrict",
            "person"."addressTown" as "addressTown",
            "person"."avatar" as "avatar",
            "user_details"."emailConfirmed" as "emailConfirmed",
            "user_details"."phoneConfirmed" as "phoneConfirmed",
            "user_details"."notifyViber" as "notifyViber",
            "user_details"."notifyTelegram" as "notifyTelegram",
            "user_details"."notifySMS" as "notifySMS",
            "user_details"."notifyEmail" as "notifyEmail",
            "user_details"."notifyAboutNewPoll" as "notifyAboutNewPoll",
            "user_details"."linkFacebook" as "linkFacebook",
            "user_details"."linkGoogle" as "linkGoogle",
            "user_details"."linkApple" as "linkApple",
            "user_details"."linkSite" as "linkSite",
            "user_details"."wpJournalistID" as "wpJournalistID",
            "user_details"."googleId" as "googleId",
            "user_details"."appleId" as "appleId",
            "user_details"."facebookId" as "facebookId",
            "user_details"."language" as "language"
        from "person"
            left join "users" on "users"."personUID" = "person"."uid"
            left join "user_details" on "user_details"."uid" = "users"."uid"
        where "person"."email" = $1
            and "person"."deletedAt" is null limit $2`,
      ],
      [profileDTO],
    )

    // WHEN get Profile
    const data = await profileService.get(profileDTO.email, new GrandAccessACS())

    // THEN immutable object profile
    expect(data).toStrictEqual(expected)
  })

  test('get profiles list', async () => {
    // GIVEN list Profiles

    // AND expected data
    const expectedPagedList = {
      list: List(listProfiles),
      metadata: {
        limit: 100,
        offset: 0,
        total: 100,
      },
    }

    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`select
          count("person"."uid")
        from "person"
          left join "users" on "users"."personUID" = "person"."uid"
        where not "users"."role" = $1
          and "person"."deletedAt" is null
        limit $2`,
        oneLine`select
            "person"."isLegalPerson" as "isLegalPerson",
            "person"."firstName" as "firstName",
            "person"."middleName" as "middleName",
            "person"."lastName" as "lastName",
            "person"."jobTitle" as "jobTitle",
            "person"."legalName" as "legalName",
            "person"."shortName" as "shortName",
            "person"."email" as "email",
            "person"."phone" as "phone",
            "person"."birthdayAt" as "birthdayAt",
            "person"."addressRegion" as "addressRegion",
            "person"."addressDistrict" as "addressDistrict",
            "person"."addressTown" as "addressTown",
            "users"."username" as "username",
            "users"."role" as "role",
            "users"."createdAt" as "createdAt"
        from "person"
            left join "users" on "users"."personUID" = "person"."uid"
        where "person"."uid" in
          (select
              "person"."uid"
          from "person"
            left join "users" on "users"."personUID" = "person"."uid"
          where not "users"."role" = $1
            and "person"."deletedAt" is null
          limit $2)`,
      ],
      [{ count: 100 }, listDtoProfiles],
    )

    // WHEN get list profiles
    const data = await profileService.list({ limit: 100, offset: 0 }, new GrandAccessACS())

    // THEN page of profile with metadata
    expect(data).toStrictEqual(expectedPagedList)
  })

  test('get ownProfile', async () => {
    // GIVEN userUID
    const uid = '00000000-aaaa-aaaa-bbbb-000000000001'

    // AND expected save query method
    knexTracker.mockSQL(
      oneLine`select
          "users"."uid" as "uid",
          "users"."username" as "username",
          "users"."role" as "role",
          "users"."systemStatus" as "systemStatus",
          "person"."isLegalPerson" as "isLegalPerson",
          "person"."isPublicPerson" as "isPublicPerson",
          "person"."firstName" as "firstName",
          "person"."middleName" as "middleName",
          "person"."lastName" as "lastName",
          "person"."jobTitle" as "jobTitle",
          "person"."legalName" as "legalName",
          "person"."shortName" as "shortName",
          "person"."tagline" as "tagline",
          "person"."email" as "email",
          "person"."phone" as "phone",
          "person"."birthdayAt" as "birthdayAt",
          "person"."gender" as "gender",
          "person"."socialStatus" as "socialStatus",
          "person"."bio" as "bio",
          "person"."addressRegion" as "addressRegion",
          "person"."addressDistrict" as "addressDistrict",
          "person"."addressTown" as "addressTown",
          "person"."avatar" as "avatar",
          "user_details"."emailConfirmed" as "emailConfirmed",
          "user_details"."phoneConfirmed" as "phoneConfirmed",
          "user_details"."notifyViber" as "notifyViber",
          "user_details"."notifyTelegram" as "notifyTelegram",
          "user_details"."notifySMS" as "notifySMS",
          "user_details"."notifyEmail" as "notifyEmail",
          "user_details"."notifyAboutNewPoll" as "notifyAboutNewPoll",
          "user_details"."linkFacebook" as "linkFacebook",
          "user_details"."linkGoogle" as "linkGoogle",
          "user_details"."linkSite" as "linkSite",
          "user_details"."linkApple" as "linkApple",
          "user_details"."wpJournalistID" as "wpJournalistID",
          "user_details"."googleId" as "googleId",
          "user_details"."appleId" as "appleId",
          "user_details"."facebookId" as "facebookId",
          "user_details"."language" as "language"
        from "person"
          left join "users" on "users"."personUID" = "person"."uid"
          left join "user_details" on "user_details"."uid" = "users"."uid"
        where "users"."uid" = $1 limit $2`,
      ownProfileDTO,
    )

    // WHEN get own profile
    const result = await profileService.getProfileByUID(uid)

    // THEN got obj profile
    expect(result).toStrictEqual(ownProfile)
  })

  test('save email confirmation code', async () => {
    // GIVEN expected save query method
    const dtoProfile: Partial<ProfileDTO> = {
      email: 'test@iviche.com',
      emailConfirmed: false,
    }
    knexTracker.mockSQL(
      [
        oneLine`select
          "users"."uid" as "uid",
          "users"."username" as "username",
          "users"."role" as "role",
          "users"."systemStatus" as "systemStatus",
          "person"."isLegalPerson" as "isLegalPerson",
          "person"."isPublicPerson" as "isPublicPerson",
          "person"."firstName" as "firstName",
          "person"."middleName" as "middleName",
          "person"."lastName" as "lastName",
          "person"."jobTitle" as "jobTitle",
          "person"."legalName" as "legalName",
          "person"."shortName" as "shortName",
          "person"."tagline" as "tagline",
          "person"."email" as "email",
          "person"."phone" as "phone",
          "person"."birthdayAt" as "birthdayAt",
          "person"."gender" as "gender",
          "person"."socialStatus" as "socialStatus",
          "person"."bio" as "bio",
          "person"."addressRegion" as "addressRegion",
          "person"."addressDistrict" as "addressDistrict",
          "person"."addressTown" as "addressTown",
          "person"."avatar" as "avatar",
          "user_details"."emailConfirmed" as "emailConfirmed",
          "user_details"."phoneConfirmed" as "phoneConfirmed",
          "user_details"."notifyViber" as "notifyViber",
          "user_details"."notifyTelegram" as "notifyTelegram",
          "user_details"."notifySMS" as "notifySMS",
          "user_details"."notifyEmail" as "notifyEmail",
          "user_details"."notifyAboutNewPoll" as "notifyAboutNewPoll",
          "user_details"."linkFacebook" as "linkFacebook",
          "user_details"."linkGoogle" as "linkGoogle",
          "user_details"."linkSite" as "linkSite",
          "user_details"."linkApple" as "linkApple",
          "user_details"."wpJournalistID" as "wpJournalistID",
          "user_details"."googleId" as "googleId",
          "user_details"."appleId" as "appleId",
          "user_details"."facebookId" as "facebookId",
          "user_details"."language" as "language"
        from "person"
          left join "users" on "users"."personUID" = "person"."uid"
          left join "user_details" on "user_details"."uid" = "users"."uid"
        where "users"."uid" = $1 limit $2`,
        oneLine`update "user_details"
        set "emailConfirmationCode" = $1,
            "emailConfirmationCodeCreatedAt" = $2
        where "uid" = $3
        and date_part('minute', now() - COALESCE(\"emailConfirmationCodeCreatedAt\", '2010-01-01 00:00:00'::timestamp)) >= 2`,
      ],
      [dtoProfile, 1],
    )

    // WHEN resend email code
    await profileService.resendEmailCode(
      '00000000-aaaa-aaaa-aaaa-000000000001',
      Language.UA,
      new EditOwnObjectACS('00000000-aaaa-aaaa-aaaa-000000000001'),
    )

    // THEN no error
  })

  test('save phone confirmation code', async () => {
    // GIVEN expected save query method
    knexTracker.mockSQL(
      [
        oneLine`select
          "users"."uid" as "uid",
          "users"."username" as "username",
          "users"."role" as "role",
          "users"."systemStatus" as "systemStatus",
          "person"."isLegalPerson" as "isLegalPerson",
          "person"."isPublicPerson" as "isPublicPerson",
          "person"."firstName" as "firstName",
          "person"."middleName" as "middleName",
          "person"."lastName" as "lastName",
          "person"."jobTitle" as "jobTitle",
          "person"."legalName" as "legalName",
          "person"."shortName" as "shortName",
          "person"."tagline" as "tagline",
          "person"."email" as "email",
          "person"."phone" as "phone",
          "person"."birthdayAt" as "birthdayAt",
          "person"."gender" as "gender",
          "person"."socialStatus" as "socialStatus",
          "person"."bio" as "bio",
          "person"."addressRegion" as "addressRegion",
          "person"."addressDistrict" as "addressDistrict",
          "person"."addressTown" as "addressTown",
          "person"."avatar" as "avatar",
          "user_details"."emailConfirmed" as "emailConfirmed",
          "user_details"."phoneConfirmed" as "phoneConfirmed",
          "user_details"."notifyViber" as "notifyViber",
          "user_details"."notifyTelegram" as "notifyTelegram",
          "user_details"."notifySMS" as "notifySMS",
          "user_details"."notifyEmail" as "notifyEmail",
          "user_details"."notifyAboutNewPoll" as "notifyAboutNewPoll",
          "user_details"."linkFacebook" as "linkFacebook",
          "user_details"."linkGoogle" as "linkGoogle",
          "user_details"."linkSite" as "linkSite",
          "user_details"."linkApple" as "linkApple",
          "user_details"."wpJournalistID" as "wpJournalistID",
          "user_details"."googleId" as "googleId",
          "user_details"."appleId" as "appleId",
          "user_details"."facebookId" as "facebookId",
          "user_details"."language" as "language"
        from "person"
          left join "users" on "users"."personUID" = "person"."uid"
          left join "user_details" on "user_details"."uid" = "users"."uid"
        where "users"."uid" = $1 limit $2`,
        oneLine`update "user_details"
        set "phoneConfirmationCode" = $1,
            "phoneConfirmationCodeCreatedAt" = $2
        where "uid" = $3
        and date_part('minute', now() - COALESCE(\"phoneConfirmationCodeCreatedAt\", '2010-01-01 00:00:00'::timestamp)) >= 2`,
      ],
      [{ phone: '380961231212' }, 1],
    )

    // WHEN resend phone code
    await profileService.resendPhoneCode(
      '00000000-aaaa-aaaa-aaaa-000000000001',
      new EditOwnObjectACS('00000000-aaaa-aaaa-aaaa-000000000001'),
    )

    // THEN no error
  })

  test('Success. Update password GrandAccessACS', async () => {
    // GIVEN username, new password, GrandAccessACS
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
      [1],
    )

    // WHEN update password
    await profileService.updatePassword(username, newPassword, new GrandAccessACS())

    // THEN don't has error
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
