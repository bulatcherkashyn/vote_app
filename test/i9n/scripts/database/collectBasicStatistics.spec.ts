import 'reflect-metadata'

import crypto from 'crypto'
import { List } from 'immutable'
import Knex from 'knex'
import { container } from 'tsyringe'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { collectBasicStatistics } from '../../../../src/iviche/jobs/functions/collectBasicStatistics'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswerStatus } from '../../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { Vote } from '../../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'
import { usersList } from '../../../database/seeds/01_InitialData'
import { TestContext } from '../../context/TestContext'

describe('Scheduler. Collect basic statistics scripts', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('collectBasicStatistics.ts collect and process 3 votes', async () => {
    // GIVEN polls data for writing to DB
    const pollToDb = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000001',
        complexWorkflow: false,
        theme: Theme.OTHER,
        status: PollStatus.VOTING,
        anonymous: true,
        publishedAt: DateUtility.now(),
        votingStartAt: DateUtility.now(),
        votingEndAt: DateUtility.now(),
        tags: List([]),
        competencyTags: List([]),
        taAgeGroups: List([]),
        taSocialStatuses: List([]),
        taGenders: List([]),
        title: 'Test title of poll #55 (created poll)',
        body: 'Test perfect body of poll #55 (created poll)',
        authorUID: usersList[2].uid as string,
        answersCount: 0,
        pollType: PollType.REGULAR,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000002',
        complexWorkflow: false,
        theme: Theme.OTHER,
        status: PollStatus.VOTING,
        anonymous: true,
        publishedAt: DateUtility.now(),
        votingStartAt: DateUtility.now(),
        votingEndAt: DateUtility.now(),
        tags: List([]),
        competencyTags: List([]),
        taAgeGroups: List([]),
        taSocialStatuses: List([]),
        taGenders: List([]),
        title: 'Test title of poll #55 (created poll)',
        body: 'Test perfect body of poll #55 (created poll)',
        authorUID: usersList[2].uid as string,
        answersCount: 3,
        pollType: PollType.REGULAR,
      },
    ]

    const pollAnswers = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000001',
        index: 1,
        title: 'yes',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000002',
        index: 1,
        title: 'no',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000003',
        index: 1,
        title: 'yes',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000002',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000004',
        index: 1,
        title: 'no',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000002',
        status: PollAnswerStatus.PUBLISHED,
      },
    ]

    const votingRound = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000001',
        createdAt: DateUtility.now(),
        startedAt: DateUtility.now(),
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000002',
        createdAt: DateUtility.now(),
        startedAt: DateUtility.now(),
      },
    ]

    const dbData: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes001 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000002',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes002 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

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

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes003 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'borzna_city',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000003',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000002',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes004 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000003',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000002',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes005 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressDistrict: 'boryspilskyi_district',
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000003',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000002',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes006 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'borzna_city',
      },
    ]

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('poll').insert(pollToDb)
    await knex('poll_answer').insert(pollAnswers)
    await knex('voting_round').insert(votingRound)
    await knex('vote').insert(dbData)

    // WHEN collectVotingResults is running
    await collectBasicStatistics(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const check = await knex('voting_result').select('*')
    const checkPoll = await knex('poll').select('*')
    // AND collectVotingResult will process current polls and generate voting_results by votes
    expect(check.length).not.toBe(0)
    expect(check[0].value).toBe(
      '{"00000000-aaaa-bbbb-cccc-000000000001":2,"00000000-aaaa-bbbb-cccc-000000000002":1}',
    )
    expect(check[1].value).toBe(
      '{"00000000-aaaa-bbbb-cccc-000000000003":3,"00000000-aaaa-bbbb-cccc-000000000004":0}',
    )
    expect(checkPoll[0].votesCount).toBe(3)
    expect(checkPoll[1].votesCount).toBe(3)
  })

  test('collectBasicStatistics.ts collect and process 3 votes for BLITZ poll', async () => {
    // GIVEN polls data for writing to DB
    const pollToDb = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000003',
        complexWorkflow: false,
        theme: Theme.OTHER,
        status: PollStatus.VOTING,
        anonymous: true,
        publishedAt: DateUtility.now(),
        votingStartAt: DateUtility.now(),
        votingEndAt: DateUtility.now(),
        tags: List([]),
        competencyTags: List([]),
        taAgeGroups: List([]),
        taSocialStatuses: List([]),
        taGenders: List([]),
        title: 'Test title of poll #55 (created poll)',
        body: 'Test perfect body of poll #55 (created poll)',
        authorUID: usersList[2].uid as string,
        answersCount: 0,
        pollType: PollType.BLITZ,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000004',
        complexWorkflow: false,
        theme: Theme.OTHER,
        status: PollStatus.VOTING,
        anonymous: true,
        publishedAt: DateUtility.now(),
        votingStartAt: DateUtility.now(),
        votingEndAt: DateUtility.now(),
        tags: List([]),
        competencyTags: List([]),
        taAgeGroups: List([]),
        taSocialStatuses: List([]),
        taGenders: List([]),
        title: 'Test title of poll #55 (created poll)',
        body: 'Test perfect body of poll #55 (created poll)',
        authorUID: usersList[2].uid as string,
        answersCount: 3,
        pollType: PollType.BLITZ,
      },
    ]

    const pollAnswers = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000005',
        index: 1,
        title: 'yes',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000003',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000006',
        index: 1,
        title: 'no',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000003',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000007',
        index: 1,
        title: 'yes',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000004',
        status: PollAnswerStatus.PUBLISHED,
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000008',
        index: 1,
        title: 'no',
        createdAt: DateUtility.now(),
        authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
        pollUID: '00000000-aaaa-bbbb-cccc-000000000004',
        status: PollAnswerStatus.PUBLISHED,
      },
    ]

    const votingRound = [
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000003',
        createdAt: DateUtility.now(),
        startedAt: DateUtility.now(),
      },
      {
        uid: '00000000-aaaa-bbbb-cccc-000000000004',
        createdAt: DateUtility.now(),
        startedAt: DateUtility.now(),
      },
    ]

    const dbData: Array<Vote> = [
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000005',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000003',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes001 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000006',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000003',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes002 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000005',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000003',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes003 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000007',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000004',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes004 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000007',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000004',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes005 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
      {
        pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000007',
        votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000004',

        voterSeed: crypto
          .createHmac('sha256', 'secret')
          .update('I love cupcakes006 ' + new Date().getTime())
          .digest('hex'),
        roundStatus: VotingRoundType.VOTING,
      },
    ]

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('poll').insert(pollToDb)
    await knex('poll_answer').insert(pollAnswers)
    await knex('voting_round').insert(votingRound)
    await knex('vote').insert(dbData)

    // WHEN collectVotingResults is running
    await collectBasicStatistics(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const check = await knex('voting_result').select('*')
    const checkPoll = await knex('poll').select('*')
    // AND collectVotingResult will process current polls and generate voting_results by votes
    expect(check.length).not.toBe(0)
    expect(check[2].value).toBe(
      '{"00000000-aaaa-bbbb-cccc-000000000005":2,"00000000-aaaa-bbbb-cccc-000000000006":1}',
    )
    expect(check[3].value).toBe(
      '{"00000000-aaaa-bbbb-cccc-000000000007":3,"00000000-aaaa-bbbb-cccc-000000000008":0}',
    )
    expect(checkPoll[2].votesCount).toBe(3)
    expect(checkPoll[3].votesCount).toBe(3)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
