import crypto from 'crypto'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { StatisticsType } from '../../../../src/iviche/statistics/model/StatisticsType'
import { StatisticServiceImpl } from '../../../../src/iviche/statistics/service/StatisticServiceImpl'
import { Vote } from '../../../../src/iviche/voting/model/Vote'

describe('StatisticService failed cases', () => {
  test('Process broken Vote. (Vote without ageGroup)', () => {
    // GIVEN vote with ageGroup as undefined

    const votes: Array<Vote> = [
      ({
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        createdAt: new Date(),
        ageGroup: undefined,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'bilotserkivskyi_district',
      } as unknown) as Vote,
    ]

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN Statistic Result should be empty
    expect(statisticResults.VOTES_DYNAMICS).toMatchObject([])
    expect(statisticResults.RESULTS_GEOGRAPHY).toMatchObject([])
  })

  test('Process broken Vote. (Vote without addressTown and addressDistrict)', () => {
    // GIVEN vote without addressTown and addressDistrict
    const votes: Array<Vote> = [
      ({
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        createdAt: new Date(),
        ageGroup: AgeGroup.THIRTY_FIVE,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
      } as unknown) as Vote,
    ]

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN Statistic Result should be empty
    expect(statisticResults.VOTES_DYNAMICS).toMatchObject([])
    expect(statisticResults.RESULTS_GEOGRAPHY).toMatchObject([])
  })
  test('Process broken Vote. (Vote with addressTown and addressDistrict)', () => {
    // GIVEN vote with addressTown and addressDistrict
    const votes: Array<Vote> = [
      ({
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        createdAt: new Date(),
        ageGroup: AgeGroup.THIRTY_FIVE,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'halytskyi_district',
        addressTown: 'vilnohirsk_city',
      } as unknown) as Vote,
    ]

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN Statistic Result should be empty
    expect(statisticResults.VOTES_DYNAMICS).toMatchObject([])
    expect(statisticResults.RESULTS_GEOGRAPHY).toMatchObject([])
  })

  test('Process aggregation with empty innerValue', () => {
    // GIVEN vote with ageGroup as undefined

    const aggregation: Map<string, Map<string, number>> = (new Map().set(
      '{"key0":"00000000-aaaa-bbbb-cccc-000000000001","key1":"KIEV_REGION"}',
      undefined,
    ) as unknown) as Map<string, Map<string, number>>

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const votingResults = service['processAggregation'](
      '00000000-aaaa-bbbb-cccc-000000000001',
      aggregation,
      StatisticsType.VOTES_DYNAMICS,
    )

    // THEN Statistic Result should be empty
    expect(votingResults.length).toBe(0)
  })
})
