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
import { collectVotingResults } from '../../../../src/iviche/jobs/functions/collectVotingResults'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { Vote } from '../../../../src/iviche/voting/model/Vote'
import { VotingResult } from '../../../../src/iviche/voting/model/VotingResult'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'
import { usersList } from '../../../database/seeds/01_InitialData'
import { TestContext } from '../../context/TestContext'

describe('Scheduler. Voting result scripts', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('collectVotingResults. collect and process 3 votes', async () => {
    // GIVEN polls data for writing toi DB
    const pollToDb = {
      uid: '00000000-aaaa-bbbb-cccc-000000000001',
      complexWorkflow: false,
      theme: Theme.OTHER,
      status: PollStatus.FINISHED,
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
    }

    const votingRound = {
      uid: '00000000-aaaa-bbbb-cccc-000000000001',
      createdAt: DateUtility.now(),
      startedAt: DateUtility.now(),
    }

    const dbData: Array<Vote> = [
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
          .update('I love cupcakes1 ' + new Date().getTime())
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
          .update('I love cupcakes2 ' + new Date().getTime())
          .digest('hex'),

        createdAt: new Date(),

        ageGroup: AgeGroup.TWENTY,
        gender: Gender.MALE,
        socialStatus: SocialStatus.STUDENT,
        addressRegion: Region.KYIV_REGION,
        addressTown: 'borzna_city',
      },
    ] // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('poll').insert(pollToDb)
    await knex('voting_round').insert(votingRound)
    await knex('vote').insert(dbData)

    // WHEN collectVotingResults is running
    await collectVotingResults(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const check = await knex('voting_result').select('*')
    const updatedPoll = await knex('poll').select('*')
    // AND collectVotingResult will process current polls and generate voting_results by votes
    expect(check.length).not.toBe(0)
    check.forEach((detail: VotingResult) => {
      if (detail.votingRoundUID === dbData[0].votingRoundUID) {
        expect(detail.value).not.toBeNull()
      }

      if (detail.votingRoundUID === dbData[1].votingRoundUID) {
        expect(detail.value).not.toBeNull()
      }

      if (detail.votingRoundUID === dbData[2].votingRoundUID) {
        expect(detail.value).not.toBeNull()
      }
    })

    // AND poll should be set as COMPLETED
    expect(updatedPoll.length).not.toBe(0)
    updatedPoll.forEach((poll: Poll) => {
      expect(poll.status).toBe(PollStatus.COMPLETED)
    })
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
