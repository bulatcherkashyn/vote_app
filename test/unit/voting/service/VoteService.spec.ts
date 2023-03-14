import 'reflect-metadata'

import { oneLine } from 'common-tags'
import crypto from 'crypto'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { VoteDAOImpl } from '../../../../src/iviche/voting/db/VoteDAOImpl'
import { VotingRoundDAOImpl } from '../../../../src/iviche/voting/db/VotingRoundDAOImpl'
import { VoteServiceImpl } from '../../../../src/iviche/voting/service/VoteServiceImpl'
import { VotingRoundServiceImpl } from '../../../../src/iviche/voting/service/VotingRoundServiceImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const knexConnection = knexTracker.getTestConnection()

const MockTelegramBotService: jest.Mock<TelegramBotServiceImpl> = jest
  .fn()
  .mockImplementation(() => {
    return {
      notifyModerators: jest.fn(),
    }
  })

const pollService = new PollServiceImpl(
  new PollDAOImpl(),
  knexConnection,
  new Elastic(),
  new ModerationDAOImpl(new PollDAOImpl(), MockTelegramBotService()),
  new PersonDAOImpl(),
)
const votingRoundService = new VotingRoundServiceImpl(new VotingRoundDAOImpl(), knexConnection)
const voteService = new VoteServiceImpl(
  knexConnection,
  new VoteDAOImpl(),
  new PersonDAOImpl(),
  votingRoundService,
  pollService,
)

function createHash(): string {
  return crypto
    .createHash('sha512')
    .update('I love cupcakes ' + new Date().getTime())
    .digest('hex')
}

describe('Vote service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('List of Votes', async () => {
    // GIVEN expected data
    const expected = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: createHash(),

        createdAt: DateUtility.fromISO('2020-01-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: createHash(),

        createdAt: DateUtility.fromISO('2020-01-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
      },
    ]
    // AND expected select query
    knexTracker.mockSQL([oneLine`select * from "vote" where "votingRoundUID" = $1`], [expected])

    // WHEN list is loaded
    const res = await voteService.list('00000000-aaaa-bbbb-cccc-000000000001')

    // THEN got expected data
    expect(res).toStrictEqual(expected)
  })

  test('Count of Votes', async () => {
    // GIVEN expected data
    const expected = [{ uid: '00000000-aaaa-bbbb-cccc-000000000001', count: 2 }]
    // AND expected select query
    knexTracker.mockSQL(
      [
        oneLine`
            select "poll_answer"."uid", count("vote".*)
            from "poll_answer"
            left outer join "vote" on "vote"."pollAnswerUID" = "poll_answer"."uid"
            where \"poll_answer\".\"status\" = $1
            and "poll_answer"."pollUID" = $2
            group by "poll_answer"."uid"`,
      ],
      [expected],
    )

    // WHEN count is loaded
    const res = await voteService.votesCount('00000000-aaaa-bbbb-cccc-000000000001')

    // THEN got expected data
    expect(res).toStrictEqual(expected)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
