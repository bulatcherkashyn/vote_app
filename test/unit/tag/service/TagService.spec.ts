import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { TagDAOImpl } from '../../../../src/iviche/tag/db/TagDAOImpl'
import { Tag } from '../../../../src/iviche/tag/model/Tag'
import { TagServiceImpl } from '../../../../src/iviche/tag/service/TagServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()

const TagService = new TagServiceImpl(new TagDAOImpl(), knexTracker.getTestConnection())

describe('TagService', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('Create  tag', async () => {
    // GIVEN tag
    const tag: Tag = {
      value: 'Test TagValue',
    }

    // AND expected insert query
    knexTracker.mockSQL(
      [
        oneLine`
        insert into
          tag ("uid", "value", "lastUseAt", "createdAt")
          values ($1, $2, $3, $4) ON CONFLICT (value) DO update set "lastUseAt" = NOW() returning *`,
      ],
      [1],
    )

    // WHEN insert tag
    await TagService.save(tag)

    // THEN no error
  })

  test('Update  tag', async () => {
    // GIVEN  tag
    const tag: Tag = {
      uid: '00000001-caaa-bbbb-cccc-000000000001',
      value: 'TestTag Value',
    }
    // AND expected update query
    knexTracker.mockSQL(
      [
        oneLine`
        update "tag"
        set "value" = $1, "lastUseAt" = $2 where "uid" = $3`,
      ],
      [1],
    )

    // WHEN update tag
    await TagService.update(tag)

    // THEN no error
  })

  test('Delete  tag', async () => {
    // GIVEN expected delete query
    knexTracker.mockSQL(
      [
        oneLine`
        delete from
          "tag"
        where
          "uid" = $1`,
      ],
      [1],
    )

    // WHEN delete tag
    await TagService.delete('00000001-caaa-bbbb-cccc-000000000001')

    // THEN no error
  })

  test('List  tag', async () => {
    // GIVEN expected data
    const expectedTag: Array<Tag> = [
      {
        uid: '00000001-caaa-bbbb-cccc-000000000001',
        value: '#Happy_new_election',
      },
      {
        uid: '00000001-caaa-bbbb-cccc-000000000002',
        value: '#ГривнаПадает',
      },
      {
        uid: '00000001-caaa-bbbb-cccc-000000000003',
        value: '#ВсеХотят$$$',
      },
      {
        uid: '00000001-caaa-bbbb-cccc-000000000004',
        value: '#Все Хотят',
      },
    ]

    // AND expected delete query
    knexTracker.mockSQL(
      [
        oneLine`
        select *
        from "tag"
        order by "lastUseAt"
        desc limit $1`,
      ],
      [expectedTag],
    )

    // WHEN delete tag
    const result = await TagService.list()

    // THEN no error and expect equal result
    expect(result).toBe(expectedTag)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
