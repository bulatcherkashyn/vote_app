import 'reflect-metadata'

import Knex from 'knex'
import request from 'supertest'
import { container } from 'tsyringe'

import { Gender } from '../../../../../src/iviche/common/Gender'
import { Region } from '../../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../../../src/iviche/common/utils/DateUtility'
import { AgeGroup } from '../../../../../src/iviche/polls/models/AgeGroup'
import { Vote } from '../../../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../../../src/iviche/voting/model/VotingRoundType'
import { VoteServiceImpl } from '../../../../../src/iviche/voting/service/VoteServiceImpl'
import {
  pollVoteSeed,
  testPollAnswer,
  testPollsList,
} from '../../../../database/seeds/TestPollForVotesList'
import {
  limitedPublicUserData,
  publicUserData,
  suspendedPublicUserData,
} from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('BLITZ VOTE', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollVoteSeed])
    done()
  })

  beforeEach(async done => {
    const knex = container.resolve<Knex>('DBConnection')
    await knex<Vote>('vote').del()
    done()
  })

  test('Blitz Vote first time. LIMITED', async () => {
    // WHEN creating new note
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[2].uid}/answers/${testPollAnswer[2].uid}/votes?blitz=true`)
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])

    // THEN vote should be created
    expect(response.status).toBe(201)

    const knex = container.resolve<Knex>('DBConnection')
    const votes = await knex<Vote>('vote').select('*')

    expect(votes.length).toBe(1)
  })

  test('Blitz Vote first time. SUSPENDED', async () => {
    // WHEN creating new note
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[2].uid}/answers/${testPollAnswer[2].uid}/votes?blitz=true`)
      .set('Cookie', [`token=${suspendedPublicUserData.jwtToken}`])

    // THEN vote should be created
    expect(response.status).toBe(403)

    const knex = container.resolve<Knex>('DBConnection')
    const votes = await knex<Vote>('vote').select('*')

    expect(votes.length).toBe(0)
  })

  test('Blitz Vote first time. ACTIVE', async () => {
    // WHEN creating new note
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[2].uid}/answers/${testPollAnswer[2].uid}/votes?blitz=true`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN vote should be created
    expect(response.status).toBe(201)

    const knex = container.resolve<Knex>('DBConnection')
    const votes = await knex<Vote>('vote').select('*')

    expect(votes.length).toBe(1)
  })

  test('Update blitz to another answer. Failed already exist', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const voterSeed = VoteServiceImpl.prototype['generateVoterSeed'].bind({ secret: 'secret' })(
      testPollsList[2].uid,
      limitedPublicUserData.uid,
    )

    await knex<Vote>('vote').insert({
      votingRoundUID: testPollsList[2].uid,
      voterSeed,
      roundStatus: VotingRoundType.VOTING,
      ageGroup: AgeGroup.THIRTY_FIVE,
      gender: Gender.FEMALE,
      socialStatus: SocialStatus.CLERK,
      addressRegion: Region.CHERKASY_REGION,
      createdAt: DateUtility.fromISO('2019-02-01'),
    })

    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[2].uid}/answers/${testPollAnswer[2].uid}/votes?blitz=true`)
      .set('Cookie', [`token=${limitedPublicUserData.jwtToken}`])

    expect(response.body.message).toEqual('Already voted')
    expect(response.body.code).toBe(403002)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
