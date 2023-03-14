import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { PollService } from '../../../../src/iviche/polls/services/PollService'
import { PollWatchDAOImpl } from '../../../../src/iviche/pollWatch/db/PollWatchDAOImpl'
import { PollWatchDTOTuple } from '../../../../src/iviche/pollWatch/dto/PollWatchDTOTuple'
import { ContactType } from '../../../../src/iviche/pollWatch/models/ContactType'
import PollWatch from '../../../../src/iviche/pollWatch/models/PollWatch'
import { PollWatchService } from '../../../../src/iviche/pollWatch/services/PollWatchService'
import { PollWatchServiceImpl } from '../../../../src/iviche/pollWatch/services/PollWatchServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { testPollWatchList } from '../../../database/seeds/TestPollWatchList'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { pollWatchTupleList } from './PollWatchTestHelper'

const knexTracker = new KnexTestTracker()

const pollServiceMock: jest.Mock<PollService> = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn().mockReturnValue({
      uid: testPollWatchList[0].uid,
      title: 'test title',
    }),
  }
})

const service: PollWatchService = new PollWatchServiceImpl(
  new PollWatchDAOImpl(),
  knexTracker.getTestConnection(),
  new pollServiceMock(),
)

describe('Poll watch service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create pollWatch', async () => {
    // GIVEN pollWatch data to be saved
    const pollWatchData: PollWatch = {
      pollUID: testPollWatchList[0].pollUID,
      pollTitle: '',
      userUID: testPollWatchList[0].userUID,
      contactType: ContactType.MANUAL,
    }
    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`insert into "poll_watch"
          ("contactType", "createdAt", "pollTitle",
          "pollUID", "uid", "userUID")
        values
          ($1, $2, $3, $4, $5, $6)`,
      ],
      [1],
    )
    // WHEN pollWatch is saved
    const uid = await service.save(pollWatchData, new GrandAccessACS())
    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('delete pollWatch', async () => {
    // GIVEN pollWatch uid to be deleted
    const uid = '00000000-aaaa-aaaa-aaaa-000000000005'
    // AND expected delete query
    knexTracker.mockSQL(['delete from "poll_watch" where "uid" = $1'], [1])
    // WHEN poll is deleted
    await service.delete(uid)

    // THEN no errors occur
  })

  test('load pollWatch list', async () => {
    // GIVEN expected Poll Watch list be loaded
    const intermediatePollWatchTuple: Array<PollWatchDTOTuple> = pollWatchTupleList
    // AND expected load query method
    knexTracker.mockSQL(
      [
        'select count("uid") from "poll_watch" limit $1',
        oneLine`
          select
            "poll_watch"."uid" as "uid",
        "poll_watch"."pollUID" as "pollUID",
        "poll"."title" as "pollTitle",
        "poll_watch"."userUID" as "userUID",
        "poll_watch"."contactType" as "contactType",
        "poll_watch"."createdAt" as "createdAt"
        from
            "poll_watch"
            left join "poll" on "poll_watch"."pollUID" = "poll"."uid"
        where "poll_watch"."uid" in (select "uid" from "poll_watch" limit $1 offset $2)`,
      ],
      [{ count: 4 }, intermediatePollWatchTuple],
    )

    const expectedPagedList = {
      list: List(pollWatchTupleList),
      metadata: {
        limit: 2,
        offset: 2,
        total: 4,
      },
    }

    // WHEN poll watch list is loaded
    const loadedList = await service.list({ limit: 2, offset: 2 }, new GrandAccessACS())
    // THEN we expect that the original list
    expect(loadedList).toEqual(expectedPagedList)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
