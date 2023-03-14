import 'reflect-metadata'

import { ServerError } from '../../../../src/iviche/error/ServerError'
import { PollService } from '../../../../src/iviche/polls/services/PollService'
import { PollWatchDAOImpl } from '../../../../src/iviche/pollWatch/db/PollWatchDAOImpl'
import { ContactType } from '../../../../src/iviche/pollWatch/models/ContactType'
import PollWatch from '../../../../src/iviche/pollWatch/models/PollWatch'
import { PollWatchService } from '../../../../src/iviche/pollWatch/services/PollWatchService'
import { PollWatchServiceImpl } from '../../../../src/iviche/pollWatch/services/PollWatchServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { testPollWatchList } from '../../../database/seeds/TestPollWatchList'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()

const pollServiceMock: jest.Mock<PollService> = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn().mockReturnValue(undefined),
  }
})

const service: PollWatchService = new PollWatchServiceImpl(
  new PollWatchDAOImpl(),
  knexTracker.getTestConnection(),
  new pollServiceMock(),
)

describe('Poll watch service fail CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create pollWatch should throw an exception with incorrect pollUID', async () => {
    // GIVEN pollWatch data with incorrect pollUID
    const pollWatchData: PollWatch = {
      pollUID: '00000000-baaa-bbbb-cccc-567800000001',
      pollTitle: '',
      userUID: testPollWatchList[0].userUID,
      contactType: ContactType.MANUAL,
    }
    try {
      // WHEN save method called with an incorrect pollUID
      // EXPECT to throw an exception
      await service.save(pollWatchData, new GrandAccessACS())
      // NOTE fail test, in a case, if exception wasn't threw
      fail('it should not reach here')
    } catch (e) {
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toBe('Poll cannot be found')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
