import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { VotingRoundDAOImpl } from '../../../../src/iviche/voting/db/VotingRoundDAOImpl'
import { VotingRoundServiceImpl } from '../../../../src/iviche/voting/service/VotingRoundServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const votingRoundService = new VotingRoundServiceImpl(
  new VotingRoundDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('Voting Round service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('Get of Voting Round', async () => {
    // GIVEN expected data
    const expected = {
      uid: '00000000-aaaa-bbbb-cccc-000000000001',
      createdAt: DateUtility.now(),
      startedAt: DateUtility.now(),
    }

    // AND expected select query
    knexTracker.mockSQL(
      [oneLine`select * from "voting_round" where "uid" = $1 limit $2`],
      [expected],
    )

    // WHEN get is loaded
    const res = await votingRoundService.get('00000000-aaaa-bbbb-cccc-000000000001')

    // THEN got expected data
    expect(res).toStrictEqual(expected)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
