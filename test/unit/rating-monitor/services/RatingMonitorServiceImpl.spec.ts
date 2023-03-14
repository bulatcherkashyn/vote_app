import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { Region } from '../../../../src/iviche/common/Region'
import { Theme } from '../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { ModerationDAO } from '../../../../src/iviche/moderation/db/ModerationDAO'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { PollAnswerStatus } from '../../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollService } from '../../../../src/iviche/polls/services/PollService'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { RatingMonitorDAOImpl } from '../../../../src/iviche/ratingMonitor/db/RatingMonitorDAOImpl'
import { RatingMonitor } from '../../../../src/iviche/ratingMonitor/models/RatingMonitor'
import { RatingMonitorService } from '../../../../src/iviche/ratingMonitor/services/RatingMonitorService'
import { RatingMonitorServiceImpl } from '../../../../src/iviche/ratingMonitor/services/RatingMonitorServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { usersList } from '../../../database/seeds/01_InitialData'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()

const moderationDAOMock: jest.Mock<ModerationDAO> = jest.fn().mockImplementation(() => {
  return {
    create: jest.fn(),
  }
})

const ElasticMock: jest.Mock<Elastic> = jest.fn().mockImplementation(() => {
  return {
    index: jest.fn(),
  }
})

const pollService: PollService = new PollServiceImpl(
  new PollDAOImpl(),
  knexTracker.getTestConnection(),
  new ElasticMock(),
  new moderationDAOMock(),
  new PersonDAOImpl(),
)

const ratingMonitorService: RatingMonitorService = new RatingMonitorServiceImpl(
  knexTracker.getTestConnection(),
  new RatingMonitorDAOImpl(new PollDAOImpl()),
  new PersonDAOImpl(),
  new moderationDAOMock(),
  pollService,
  new ElasticMock(),
)

describe('Rating monitor service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create rating monitor', async () => {
    // GIVEN poll data to be saved
    const pollData: RatingMonitor = {
      complexWorkflow: false,
      theme: Theme.OTHER,
      status: PollStatus.DRAFT,
      anonymous: true,
      publishedAt: DateUtility.now(),
      votingStartAt: DateUtility.now(),
      votingEndAt: undefined,
      tags: List([]),
      competencyTags: List([]),
      taAgeGroups: List([]),
      taSocialStatuses: List([]),
      taGenders: List([]),
      title: 'Test title of poll #55 (created poll)',
      body: 'Test perfect body of poll #55 (created poll)',
      authorUID: usersList[2].uid as string,
      answersCount: 1,
      votesCount: 0,
      commentsCount: 0,
      taAddressRegion: Region.IVANO_FRANKIVSK_REGION,
      answers: List([
        {
          title: 'test1',
          basic: false,
          createdAt: new Date('02.02.2020'),
          index: 0,
          pollUID: '',
          authorUID: '',
          status: PollAnswerStatus.MODERATION,
        },
      ]),
      pollType: PollType.RATING_MONITOR,
      image: '00000000-test-image-uuid-000000000001',
    }
    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`insert into "poll"
          ("anonymous", "answersCount", "authorUID",
          "body", "competencyTags", "complexWorkflow",
          "createdAt", "discussionStartAt", "image", "pollType", "status",
          "taAddressDistrict", "taAddressRegion", "taAddressTown",
          "taAgeGroups", "taGenders", "taSocialStatuses",
          "tags", "theme", "title", "uid",
          "votingEndAt", "votingStartAt")
        values
          ($1, $2, $3, $4, $5, $6, $7, DEFAULT, $8, $9, $10, DEFAULT, $11, DEFAULT, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        oneLine`insert into "poll_answer" ("authorUID", "basic", "createdAt", "index", "pollUID", "status", "title", "uid")
        values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ],
      [1, 1],
    )
    // WHEN poll is saved
    const uid = await ratingMonitorService.savePoll(pollData, true, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('delete rating monitor', async () => {
    // GIVEN poll uid to be deleted
    const pollUid = '00000000-aaaa-aaaa-aaaa-000000000005'
    // AND expected delete query
    knexTracker.mockSQL(
      ['delete from "poll_answer" where "pollUID" = $1', 'delete from "poll" where "uid" = $1'],
      [1, 1],
    )
    // WHEN poll is deleted
    await ratingMonitorService.delete(pollUid, new GrandAccessACS())

    // THEN no errors occur
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
