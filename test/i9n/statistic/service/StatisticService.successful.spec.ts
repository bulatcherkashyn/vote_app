/* eslint-disable @typescript-eslint/camelcase */
import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { StatisticServiceImpl } from '../../../../src/iviche/statistics/service/StatisticServiceImpl'
import { Vote } from '../../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'
import { createHash, testVotesList } from '../../../database/seeds/TestVotesList'

describe('StatisticService successful cases', () => {
  test('Process test Votes array', () => {
    // GIVEN test votes list
    const votes = testVotesList

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN votes dynamics should contains 8 results and result geography should contains 6 results
    if (statisticResults.RESULTS_GEOGRAPHY) {
      expect(statisticResults.RESULTS_GEOGRAPHY.length).toBe(5)
      expect(statisticResults.RESULTS_GEOGRAPHY[0].value).toMatchObject({
        boryspilskyi_district: 2,
      })
      expect(statisticResults.RESULTS_GEOGRAPHY[1].value).toMatchObject({
        kobeliatskyi_district: 1,
      })
      expect(statisticResults.RESULTS_GEOGRAPHY[2].value).toMatchObject({
        borznianskyi_district: 1,
      })
      expect(statisticResults.RESULTS_GEOGRAPHY[3].value).toMatchObject({
        apostolivskyi_district: 1,
        vilnohirsk_city: 1,
      })
      expect(statisticResults.RESULTS_GEOGRAPHY[4].value).toMatchObject({
        halytskyi_district: 4,
      })
    }
    if (statisticResults.VOTES_DYNAMICS) {
      expect(statisticResults.VOTES_DYNAMICS.length).toBe(8)
      expect(statisticResults.VOTES_DYNAMICS[0].value).toMatchObject({
        [DateUtility.fromISO('2020-01-25')
          .toISOString()
          .substring(0, 10)]: 2,
      })
      expect(statisticResults.VOTES_DYNAMICS[1].value).toMatchObject({
        [DateUtility.fromISO('2020-01-25')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[2].value).toMatchObject({
        [DateUtility.fromISO('2020-01-27')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[3].value).toMatchObject({
        [DateUtility.fromISO('2020-01-23')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[4].value).toMatchObject({
        [DateUtility.fromISO('2020-01-24')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[5].value).toMatchObject({
        [DateUtility.fromISO('2020-01-23')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[6].value).toMatchObject({
        [DateUtility.fromISO('2020-01-23')
          .toISOString()
          .substring(0, 10)]: 1,
      })
      expect(statisticResults.VOTES_DYNAMICS[7].value).toMatchObject({
        [DateUtility.fromISO('2020-01-23')
          .toISOString()
          .substring(0, 10)]: 2,
      })
    }
  })

  test('Process test Votes array with addressDistrict (without addressTown)', () => {
    // GIVEN test votes list with addressDistrict (without addressTown)
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: createHash(),

        createdAt: DateUtility.fromISO('2020-01-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
    ]

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN result geography should contains 1 results (not empty)
    if (statisticResults.RESULTS_GEOGRAPHY) {
      expect(statisticResults.RESULTS_GEOGRAPHY.length).toBe(1)
      expect(statisticResults.RESULTS_GEOGRAPHY[0].value).toMatchObject({
        boryspilskyi_district: 1,
      })
    }
  })

  test('Process test Votes array with addressTown (without addressDistrict)', () => {
    // GIVEN test votes list with addressTown (without addressDistrict)
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: createHash(),

        createdAt: DateUtility.fromISO('2020-01-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.DNIPROPETROVSK_REGION,
        addressTown: 'vilnohirsk_city',
      },
    ]

    // WHEN service process votes
    const service = new StatisticServiceImpl()
    const statisticResults = service.getVotingResults('00000000-aaaa-bbbb-cccc-000000000001', votes)

    // THEN result geography should contains 1 results (not empty)
    if (statisticResults.RESULTS_GEOGRAPHY) {
      expect(statisticResults.RESULTS_GEOGRAPHY.length).toBe(1)
      expect(statisticResults.RESULTS_GEOGRAPHY[0].value).toMatchObject({
        vilnohirsk_city: 1,
      })
    }
  })
})
