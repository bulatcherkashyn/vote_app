import crypto from 'crypto'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { VoteDynamicsProcessor } from '../../../../src/iviche/statistics/processor/VoteDynamicsProcessor'
import { Vote } from '../../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'

describe('Vote Dynamics Processor consume test', () => {
  test('consume votes and get aggregation by date', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,
        createdAt: DateUtility.fromISO('2020-02-25'),

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

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,

        createdAt: DateUtility.fromISO('2020-02-26'),

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

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,

        createdAt: DateUtility.fromISO('2020-02-26'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
    ]

    const processor = new VoteDynamicsProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 1 aggregation with 2 inner values
    const keys = Array.from(aggregation.keys())
    for (const k of keys) {
      expect(aggregation.has(k)).toBe(true)
      const innerValue = aggregation.get(k)
      if (innerValue) {
        expect(innerValue.size).toBe(2)

        const innerKeys = Array.from(innerValue.keys())
        expect(innerKeys[0]).toBe(
          DateUtility.fromISO('2020-02-25')
            .toISOString()
            .substring(0, 10),
        )
        expect(innerKeys[1]).toBe(
          DateUtility.fromISO('2020-02-26')
            .toISOString()
            .substring(0, 10),
        )
      }
    }
  })

  test('consume votes and get aggregation by social status', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
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
        socialStatus: SocialStatus.SELFEMPLOYED,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
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
        addressDistrict: 'district',
        addressTown: 'town',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(new Date().getTime() - 10000),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
    ]

    const processor = new VoteDynamicsProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 2 aggregations
    expect(aggregation.size).toBe(2)

    const keys = Array.from(aggregation.keys())

    expect(keys[0]).toBe('{"key0":"SELFEMPLOYED","key1":"18-20","key2":"MALE"}')
    expect(keys[1]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"MALE"}')
  })

  test('consume votes and get aggregation by gender', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
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
        gender: Gender.FEMALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
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
        addressDistrict: 'district',
        addressTown: 'town',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(new Date().getTime() - 10000),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
    ]

    const processor = new VoteDynamicsProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 2 aggregations
    expect(aggregation.size).toBe(2)

    const keys = Array.from(aggregation.keys())

    expect(keys[0]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"FEMALE"}')
    expect(keys[1]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"MALE"}')
  })

  test('consume votes and get aggregation by age group', () => {
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

        ageGroup: AgeGroup.FORTY_FIVE,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
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
        addressDistrict: 'district',
        addressTown: 'town',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(new Date().getTime() - 10000),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
    ]

    const processor = new VoteDynamicsProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 2 aggregations
    expect(aggregation.size).toBe(2)

    const keys = Array.from(aggregation.keys())

    expect(keys[0]).toBe('{"key0":"STUDENT","key1":"36-45","key2":"MALE"}')
    expect(keys[1]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"MALE"}')
  })

  test('consume votes and get aggregation by gender, age group, social status and date', () => {
    // GIVEN votes for test
    const votes: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,

        createdAt: DateUtility.fromISO('2020-02-26'),

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
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: DateUtility.fromISO('2020-02-26'),

        ageGroup: AgeGroup.FORTY_FIVE,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
        roundStatus: VotingRoundType.DISCUSSION,

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),

        createdAt: DateUtility.fromISO('2020-02-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.FEMALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.DISCUSSION,

        createdAt: DateUtility.fromISO('2020-02-25'),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.UNEMPLOYED,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'district',
        addressTown: 'town2',
      },
    ]

    const processor = new VoteDynamicsProcessor()

    // WHEN processor consume votes
    votes.forEach((vote: Vote) => {
      processor.consume(vote)
    })

    // THEN get aggregation from processor
    const aggregation = processor.getAggregation()

    // AND aggregation should contains 4 aggregation with 2 inner values
    expect(aggregation.size).toBe(4)

    const keys = Array.from(aggregation.keys())

    expect(keys[0]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"MALE"}')
    expect(keys[1]).toBe('{"key0":"STUDENT","key1":"36-45","key2":"MALE"}')
    expect(keys[2]).toBe('{"key0":"STUDENT","key1":"18-20","key2":"FEMALE"}')
    expect(keys[3]).toBe('{"key0":"UNEMPLOYED","key1":"18-20","key2":"MALE"}')

    const studentMaleTwenty = aggregation.get(keys[0])
    if (studentMaleTwenty) {
      const innerKeys = Array.from(studentMaleTwenty.keys())
      expect(innerKeys[0]).toBe(
        DateUtility.fromISO('2020-02-26')
          .toISOString()
          .substring(0, 10),
      )
    }

    const studentMaleFortyFive = aggregation.get(keys[1])
    if (studentMaleFortyFive) {
      const innerKeys = Array.from(studentMaleFortyFive.keys())
      expect(innerKeys[0]).toBe(
        DateUtility.fromISO('2020-02-26')
          .toISOString()
          .substring(0, 10),
      )
    }

    const studentFemaleTwenty = aggregation.get(keys[2])
    if (studentFemaleTwenty) {
      const innerKeys = Array.from(studentFemaleTwenty.keys())
      expect(innerKeys[0]).toBe(
        DateUtility.fromISO('2020-02-25')
          .toISOString()
          .substring(0, 10),
      )
    }

    const unemployedMaleTwenty = aggregation.get(keys[3])
    if (unemployedMaleTwenty) {
      const innerKeys = Array.from(unemployedMaleTwenty.keys())
      expect(innerKeys[0]).toBe(
        DateUtility.fromISO('2020-02-25')
          .toISOString()
          .substring(0, 10),
      )
    }
  })
})
