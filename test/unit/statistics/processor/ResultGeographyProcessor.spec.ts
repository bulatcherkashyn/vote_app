import crypto from 'crypto'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { ResultGeographyProcessor } from '../../../../src/iviche/statistics/processor/ResultGeographyProcessor'
import { Vote } from '../../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'

describe('Result Geography Processor consume test', () => {
  test('consume votes and get aggregation by district', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),
        roundStatus: VotingRoundType.DISCUSSION,

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),
        roundStatus: VotingRoundType.DISCUSSION,

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'fastivskyi_district',
      },
    ]

    const processor = new ResultGeographyProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // AND get aggregation from processor
    const aggregation = processor.getAggregation()

    // THEN aggregation should contains 1 aggregation with 2 inner values
    const keys = Array.from(aggregation.keys())
    for (const k of keys) {
      expect(aggregation.has(k)).toBe(true)
      const innerValue = aggregation.get(k)

      if (innerValue) {
        expect(innerValue.size).toBe(2)

        const keys = Array.from(innerValue.keys())
        expect(keys[0]).toBe('baryshivskyi_district')
        expect(keys[1]).toBe('fastivskyi_district')
        expect(innerValue.get(keys[0])).toBe(2)
        expect(innerValue.get(keys[1])).toBe(1)
      }
    }
  })
  test('consume votes and get aggregation by town. (with and without centerOf)', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),
        roundStatus: VotingRoundType.DISCUSSION,

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'baryshivskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'boryspil_city',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'bucha_city',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'bucha_city',
      },
    ]

    const processor = new ResultGeographyProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // AND get aggregation from processor
    const aggregation = processor.getAggregation()

    // THEN aggregation should contains 1 aggregation with 2 inner values
    const keys = Array.from(aggregation.keys())
    for (const k of keys) {
      expect(aggregation.has(k)).toBe(true)
      const innerValue = aggregation.get(k)

      if (innerValue) {
        expect(innerValue.size).toBe(3)

        const keys = Array.from(innerValue.keys())
        expect(keys[0]).toBe('baryshivskyi_district')
        expect(keys[1]).toBe('boryspilskyi_district')
        expect(keys[2]).toBe('bucha_city')
      }
    }
  })

  test('consume votes and get aggregation by address region', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'yahotynskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'tarashchanskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.DNIPROPETROVSK_REGION,
        addressDistrict: 'dniprovskyi_district',
      },
    ]

    const processor = new ResultGeographyProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 2 aggregations by regions
    expect(aggregation.size).toBe(2)

    const keys = Array.from(aggregation.keys())
    expect(keys[0]).toBe('{"key0":"00000000-aaaa-bbbb-cccc-000000000001","key1":"KYIV_REGION"}')
    expect(keys[1]).toBe(
      '{"key0":"00000000-aaaa-bbbb-cccc-000000000001","key1":"DNIPROPETROVSK_REGION"}',
    )
  })

  test('consume votes and get aggregation by address region, district and poll answer uid', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000002',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        roundStatus: VotingRoundType.DISCUSSION,
        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.DNIPROPETROVSK_REGION,
        addressDistrict: 'dniprovskyi_district',
      },
    ]

    const processor = new ResultGeographyProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 3 aggregations by regions and pollAnswerUID
    expect(aggregation.size).toBe(3)

    const keys = Array.from(aggregation.keys())
    expect(keys[0]).toBe('{"key0":"00000000-aaaa-bbbb-cccc-000000000002","key1":"KYIV_REGION"}')
    expect(keys[1]).toBe('{"key0":"00000000-aaaa-bbbb-cccc-000000000001","key1":"KYIV_REGION"}')
    expect(keys[2]).toBe(
      '{"key0":"00000000-aaaa-bbbb-cccc-000000000001","key1":"DNIPROPETROVSK_REGION"}',
    )
  })
})
