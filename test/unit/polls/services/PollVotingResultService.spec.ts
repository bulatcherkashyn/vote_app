import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { ErrorCodes } from '../../../../src/iviche/error/ErrorCodes'
import { PollVotingResultDAOImpl } from '../../../../src/iviche/polls/db/PollVotingResultDAOImpl'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollVotingResultService } from '../../../../src/iviche/polls/services/PollVotingResultService'
import { PollVotingResultServiceImpl } from '../../../../src/iviche/polls/services/PollVotingResultServiceImpl'
import { StatisticsType } from '../../../../src/iviche/statistics/model/StatisticsType'
import { VotingResult } from '../../../../src/iviche/voting/model/VotingResult'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const pollVotingResultService: PollVotingResultService = new PollVotingResultServiceImpl(
  new PollVotingResultDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('Poll voting result service tests (create and list)', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create batch of 3 voting results', async () => {
    // GIVEN batch of voting results
    const votingResultsToCreate: Array<VotingResult> = [
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.VOTES_DYNAMICS,
        key0: SocialStatus.STUDENT,
        key1: AgeGroup.FORTY_FIVE,
        key2: Gender.MALE,
        value: { [DateUtility.fromISO('10.11.2020').toString()]: 1 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.VOTES_DYNAMICS,
        key0: SocialStatus.STUDENT,
        key1: AgeGroup.FORTY_FIVE,
        key2: Gender.MALE,
        value: { [DateUtility.fromISO('11.11.2020').toString()]: 2 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.RESULTS_GEOGRAPHY,
        key0: '00000000-aaaa-aaaa-aaaa-000000000001',
        key1: Region.POLTAVA_REGION,
        value: { ['town1']: 1 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
    ]

    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`
        insert into "voting_result"
        ("createdAt",
         "finalAggregation",
         "key0",
         "key1",
         "key2",
         "statisticsType",
         "value",
         "votingRoundUID")
      values
       ($1, $2, $3, $4, $5, $6, $7, $8),
       ($9, $10, $11, $12, $13, $14, $15, $16),
       ($17, $18, $19, $20, DEFAULT, $21, $22, $23)`,
      ],
      [{}],
    )

    // WHEN THEN voting results created
    await pollVotingResultService.create(votingResultsToCreate)

    //Nothing to check due to return type of create function
  })

  test('create batch of 1001 voting results', async () => {
    // GIVEN batch of voting results
    const votingResultsToCreate: Array<VotingResult> = []

    for (let i = 0; i < 1001; i++) {
      votingResultsToCreate.push({
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.VOTES_DYNAMICS,
        key0: SocialStatus.STUDENT,
        key1: AgeGroup.FORTY_FIVE,
        key2: Gender.MALE,
        value: { [DateUtility.fromISO('10.11.2020').toString()]: 1 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      })
    }

    knexTracker.mockSQL(['ROLLBACK'], [{}])

    try {
      // WHEN voting results created
      await pollVotingResultService.create(votingResultsToCreate)
    } catch (e) {
      // THEN service should throw exception
      expect(e.errorCode).toBe(ErrorCodes.BATCH_SIZE_ERROR)
      expect(e.message).toBe(`Batch size is [${votingResultsToCreate.length}]`)
    }
  })

  test('get list of voting results', async () => {
    // GIVEN expected list of votingResults to be loaded
    const expectedVotingResultList: Array<VotingResult> = [
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.VOTES_DYNAMICS,
        key0: SocialStatus.STUDENT,
        key1: AgeGroup.FORTY_FIVE,
        key2: Gender.MALE,
        value: { [DateUtility.fromISO('10.11.2020').toString()]: 1 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.VOTES_DYNAMICS,
        key0: SocialStatus.STUDENT,
        key1: AgeGroup.FORTY_FIVE,
        key2: Gender.MALE,
        value: { [DateUtility.fromISO('11.11.2020').toString()]: 2 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.RESULTS_GEOGRAPHY,
        key0: '00000000-aaaa-aaaa-aaaa-000000000001',
        key1: Region.POLTAVA_REGION,
        value: { ['town1']: 1 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
      {
        votingRoundUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        statisticsType: StatisticsType.RESULTS_GEOGRAPHY,
        key0: '00000000-aaaa-aaaa-aaaa-000000000001',
        key1: Region.POLTAVA_REGION,
        value: { ['town2']: 2 },
        finalAggregation: true,
        createdAt: DateUtility.now(),
      },
    ]

    // AND expected load query
    knexTracker.mockSQL(
      ['select * from "voting_result" where "votingRoundUID" = $1'],
      [expectedVotingResultList],
    )

    // WHEN votingResult is loaded
    const loadedList = await pollVotingResultService.list('00000000-aaaa-aaaa-aaaa-000000000001')

    // THEN loadedList must be equal to the expected one
    expect(Array.from(loadedList)).toMatchObject(expectedVotingResultList)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
