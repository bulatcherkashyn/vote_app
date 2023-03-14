import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { UserDetailsDAOImpl } from '../../../../src/iviche/users/db/UserDetailsDAOImpl'
import { UserDetails } from '../../../../src/iviche/users/models/UserDetails'
import { UserDetailsService } from '../../../../src/iviche/users/services/UserDetailsService'
import { UserDetailsServiceImpl } from '../../../../src/iviche/users/services/UserDetailsServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const userDetailsService: UserDetailsService = new UserDetailsServiceImpl(
  new UserDetailsDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('User Details service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create user details', async () => {
    // GIVEN user details data to be saved
    const userDetailsData: UserDetails = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000006',
      emailConfirmed: true,
      phoneConfirmed: false,
      createdAt: DateUtility.now(),
      new: true,
    }

    // AND expected save query
    knexTracker.mockSQL(
      [
        oneLine`
        insert into "user_details" ("appleId", "createdAt", "emailConfirmationCode", "emailConfirmationCodeCreatedAt",
        "emailConfirmed", "facebookId", "googleId", "linkApple", "linkFacebook", "linkGoogle", "linkSite", "newsPreferences", "notifyAboutNewPoll",
        "notifyEmail", "notifySMS", "notifyTelegram", "notifyViber", "passwordRestorationCode", "phoneConfirmationCode",
        "phoneConfirmed", "uid", "wpJournalistID") values (DEFAULT, $1, DEFAULT, DEFAULT, $2, DEFAULT, DEFAULT,
        DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT, $3, $4, DEFAULT)`,
      ],
      [{}],
    )

    // WHEN user details is saved
    const uid = await userDetailsService.save(userDetailsData, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('update user details', async () => {
    // GIVEN user details to run update
    const userDetailsData: UserDetails = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000006',
      emailConfirmed: true,
      phoneConfirmed: false,
      createdAt: DateUtility.now(),
    }
    // AND expected update query
    knexTracker.mockSQL(
      [
        oneLine`
        update "user_details"
        set "emailConfirmed" = $1, "phoneConfirmed" = $2
        where "uid" = $3`,
      ],
      [1],
    )

    // WHEN user details is saved
    const uid = await userDetailsService.save(userDetailsData, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been returned
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('update user details by email', async () => {
    // GIVEN user details to run update
    const userDetailsData: UserDetails = {
      notifyEmail: true,
      linkSite: 'blabla.com',
    }
    // AND expected update query
    knexTracker.mockSQL(
      [
        oneLine`update "user_details" set "notifyEmail" = $1, "linkSite" = $2 where "uid" in (select "uid" from "users" where "username" = $3 limit $4)`,
      ],
      [1],
    )

    // WHEN user details is saved
    await userDetailsService.updateByUsername(
      userDetailsData,
      'testmail@gmail.com',
      new GrandAccessACS(),
    )

    // THEN we expect that tracker works fine
  })

  test('delete user details', async () => {
    // GIVEN user details uid to be deleted
    const userDetailsUid = '00000000-aaaa-aaaa-aaaa-000000000005'

    // AND expected delete query
    knexTracker.mockSQL(['update "user_details" set "deletedAt" = $1 where "uid" = $2'], [1])

    // WHEN user details is deleted
    await userDetailsService.delete(userDetailsUid, new GrandAccessACS())

    // THEN no errors occur
  })

  test('load page UserDetails list', async () => {
    // GIVEN expected empty objects list to be loaded - it is not supported
    const res = {
      list: List([]),
      metadata: {
        limit: 0,
        offset: 0,
        total: 0,
      },
    }

    // WHEN user details list is loaded
    const emptyList = await userDetailsService.list({ limit: 2, offset: 2 }, new GrandAccessACS())

    // THEN an empty list must be loaded
    expect(emptyList).toEqual(res)
  })

  test('load user details', async () => {
    // GIVEN user details uid to be loaded
    const userDetailsUid = '00000000-aaaa-aaaa-aaaa-000000000006'
    // AND expected expected user details data
    const expectedUserDetails: UserDetails = {
      uid: userDetailsUid,
      emailConfirmed: true,
      phoneConfirmed: false,
      createdAt: DateUtility.now(),
    }
    // AND expected load query method
    knexTracker.mockSQL(
      ['select * from "user_details" where "uid" = $1 and "deletedAt" is null limit $2'],
      [expectedUserDetails],
    )

    // WHEN user details is loaded
    const loadedUserDetails = await userDetailsService.get(userDetailsUid, new GrandAccessACS())

    // THEN we expect that the loaded data is equal to the expected one
    expect(loadedUserDetails).toEqual(expectedUserDetails)
  })
  afterEach(() => {
    knexTracker.uninstall()
  })
})
