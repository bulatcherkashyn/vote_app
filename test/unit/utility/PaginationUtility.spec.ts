import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { TrxUtility } from '../../../src/iviche/db/TrxUtility'
import { EntityFilter } from '../../../src/iviche/generic/model/EntityFilter'
import { PaginationUtility } from '../../../src/iviche/generic/utils/PaginationUtility'
import { Poll } from '../../../src/iviche/polls/models/Poll'
import { KnexTestTracker } from '../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()

describe('Pagination Utility', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('query with desc', async () => {
    // GIVEN list Filter data
    const filter: EntityFilter = {
      limit: 2,
      offset: 2,
      order: {
        asc: false,
        orderBy: 'uid',
      },
    }

    // AND expected save query method
    knexTracker.mockSQL(
      [oneLine`select * from "polls" order by "uid" desc limit $1 offset $2`],
      [{}],
    )

    await TrxUtility.transactional<void>(knexTracker.getTestConnection(), async trxUtility => {
      const trx = await trxUtility()

      // AND expected save query method
      const mainQuery = trx<Poll>('polls')

      // WHEN calculate PaginationMetadata

      await PaginationUtility.applyPaginationForQuery(mainQuery, filter).select('*')

      // THEN don`t has errors
    })
  })

  test('calculate PaginationMetadata', async () => {
    // GIVEN list Filter data
    const filter: EntityFilter = {
      limit: 2,
      offset: 2,
    }
    // AND expected data
    const metadata = {
      limit: 2,
      offset: 2,
      total: 100,
    }

    // AND expected save query method
    knexTracker.mockSQL([oneLine`select count("uid") from "polls" limit $1`], [{ count: 100 }])

    await TrxUtility.transactional<void>(knexTracker.getTestConnection(), async trxUtility => {
      const trx = await trxUtility()

      // AND expected save query method
      const mainQuery = trx<Poll>('polls')

      // WHEN calculate PaginationMetadata
      const paginationMeta = await PaginationUtility.calculatePaginationMetadata(mainQuery, filter)

      // THEN got metadata
      expect(paginationMeta).toStrictEqual(metadata)
    })
  })

  test('get query', async () => {
    // GIVEN list Filter data
    const filter: EntityFilter = {
      limit: 21,
      offset: 21,
      order: {
        asc: true,
        orderBy: 'uid',
      },
    }

    // AND expected save query method
    knexTracker.mockSQL(
      [oneLine`select * from "polls" order by "uid" asc limit $1 offset $2`],
      [{}],
    )

    await TrxUtility.transactional<void>(knexTracker.getTestConnection(), async trxUtility => {
      const trx = await trxUtility()

      // AND expected save query method
      const mainQuery = trx<Poll>('polls')

      // WHEN calculate PaginationMetadata
      await PaginationUtility.applyPaginationForQuery(mainQuery, filter).select('*')

      // THEN don`t have errors
    })
  })

  test('fail get query, offset > total', async () => {
    // GIVEN list Filter data
    const filter: EntityFilter = {
      limit: 2,
      offset: 100,
    }

    // AND expected save query method
    knexTracker.mockSQL([oneLine`select count("uid") from "polls" limit $1`], [{ count: 50 }])

    await TrxUtility.transactional<void>(knexTracker.getTestConnection(), async trxUtility => {
      const trx = await trxUtility()

      // AND expected save query method
      const mainQuery = trx<Poll>('polls')

      try {
        // WHEN calculate PaginationMetadata
        await PaginationUtility.calculatePaginationMetadata(mainQuery, filter)
      } catch (e) {
        // THEN got error
        expect(e.message).toBe('Offset bigger than total rows count')
      }
    })
  })

  test('Undefined result on calculatePaginationMetadata', async () => {
    // GIVEN list Filter data
    const filter: EntityFilter = {
      limit: 2,
      offset: 2,
    }

    // AND expected save query method
    knexTracker.mockSQL([oneLine`select count("uid") from "polls" limit $1`], [undefined])

    await TrxUtility.transactional<void>(knexTracker.getTestConnection(), async trxUtility => {
      const trx = await trxUtility()

      // AND expected save query method
      const mainQuery = trx<Poll>('polls')

      try {
        // WHEN calculate PaginationMetadata
        await PaginationUtility.calculatePaginationMetadata(mainQuery, filter)
      } catch (e) {
        // THEN got error
        expect(e.message).toBe('Count query returned undefined. This should never really happen.')
      }
    })
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
