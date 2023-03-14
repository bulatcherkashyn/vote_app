import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { UserDAOImpl } from '../../../../src/iviche/users/db/UserDAOImpl'
import { User } from '../../../../src/iviche/users/models/User'
import { UserService } from '../../../../src/iviche/users/services/UserService'
import { UserServiceImpl } from '../../../../src/iviche/users/services/UserServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const userService: UserService = new UserServiceImpl(
  new UserDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('Fail User service tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('Fail update - User don`t found ', async () => {
    // GIVEN user data
    const userData = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      username: 'Test@dewais.com',
    }

    // AND expected update query
    knexTracker.mockSQL([oneLine`update "users" set "username" = $1 where "uid" = $2`], [2], false)

    // WHEN user is saved
    try {
      await userService.save(userData as User, new GrandAccessACS())
    } catch (e) {
      // THEN we expect server error
      expect(e.message).toBe('update for entity [user] failed')
    }
  })

  test('delete User fail 404', async () => {
    // GIVEN expected update query and UID
    knexTracker.mockSQL(
      [oneLine`update "users" set "role" = $1, "deletedAt" = $2 where "uid" = $3`],
      [0],
      false,
    )

    try {
      // WHEN user is saved
      await userService.delete('00000000-aaaa-aaaa-aaaa-000000000001', new GrandAccessACS())
    } catch (e) {
      // THEN got error
      expect(e.message).toBe('Not found [user] entity for delete')
    }
  })

  test('Fail delete User - got many delete', async () => {
    // GIVEN expected update query
    knexTracker.mockSQL(
      [oneLine`update "users" set "role" = $1, "deletedAt" = $2 where "uid" = $3`],
      [2],
      false,
    )

    try {
      // WHEN user is saved
      await userService.delete('00000000-aaaa-aaaa-aaaa-000000000001', new GrandAccessACS())
    } catch (e) {
      // THEN got error
      expect(e.message).toBe('delete for entity [user] failed')
    }
  })

  test('Fail Update last login User - got many updates', async () => {
    // GIVEN expected update query and UID
    knexTracker.mockSQL(
      [oneLine`update "users" set "lastLoginAt" = $1 where "uid" = $2`],
      [2],
      false,
    )

    try {
      // WHEN user is saved
      await userService.updateUserLastLogin('00000000-aaaa-aaaa-aaaa-000000000001')
    } catch (e) {
      // THEN got error
      expect(e.message).toBe('last-login-upd for entity [user] failed')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
