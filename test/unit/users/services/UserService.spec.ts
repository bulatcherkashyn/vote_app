import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { UserRole } from '../../../../src/iviche/common/UserRole'
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

describe('User service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('update User', async () => {
    const userData = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      username: 'Test@dewais.com',
    }
    // AND expected update query
    knexTracker.mockSQL([oneLine`update "users" set "username" = $1 where "uid" = $2`], [1])

    // WHEN user is saved
    await userService.save(userData as User, new GrandAccessACS())

    // THEN we expect that tracker works fine
  })

  test('Delete User', async () => {
    // GIVEN expected update query
    knexTracker.mockSQL(
      [oneLine`update "users" set "role" = $1, "deletedAt" = $2 where "uid" = $3`],
      [1],
    )

    // WHEN user is deleted
    await userService.delete('00000000-aaaa-aaaa-aaaa-000000000001', new GrandAccessACS())

    // THEN we expect that tracker works fine
  })

  test('Update last login User', async () => {
    // GIVEN expected update query
    knexTracker.mockSQL([oneLine`update "users" set "lastLoginAt" = $1 where "uid" = $2`], [1])

    // WHEN update time of login
    await userService.updateUserLastLogin('00000000-aaaa-aaaa-aaaa-000000000001')

    // THEN we don`t has error
  })

  test('List of Users', async () => {
    // GIVEN expected data
    const expected = {
      list: List([
        {
          role: UserRole.PRIVATE,
          username: 'test1@gmail.com',
          password: '',
          createdAt: new Date('1900-01-01T00:00:00.000Z'),
        },
        {
          role: UserRole.PRIVATE,
          username: 'test2@gmail.com',
          password: '',
          createdAt: new Date('1900-01-01T00:00:00.000Z'),
        },
      ]),
      metadata: {
        limit: 2,
        offset: 2,
        total: 4,
      },
    }
    // AND expected update query
    knexTracker.mockSQL(
      [
        oneLine`select count("uid") from "users" where "deletedAt" is null limit $1`,
        oneLine`select * from "users" where "deletedAt" is null limit $1 offset $2`,
      ],
      [{ count: 4 }, expected.list.toArray()],
    )

    // WHEN user is saved
    const res = await userService.list({ limit: 2, offset: 2 }, new GrandAccessACS())

    // THEN got expected error
    expect(res).toStrictEqual(expected)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
