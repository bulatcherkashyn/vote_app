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
import { publicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('VOTE', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollVoteSeed])
    done()
  })

  beforeEach(async done => {
    const knex = container.resolve<Knex>('DBConnection')
    await knex<Vote>('vote').del()
    done()
  })

  test('Vote first time. Successfully', async () => {
    // WHEN creating new note
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[0].uid}/answers/${testPollAnswer[0].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // THEN vote should be created
    expect(response.status).toBe(201)

    const knex = container.resolve<Knex>('DBConnection')
    const votes = await knex<Vote>('vote').select('*')

    expect(votes.length).toBe(1)
  })

  test('Revote. Failed 1 min delay', async () => {
    // WHEN create a vote
    await request(TestContext.app)
      .post(`/polls/${testPollsList[0].uid}/answers/${testPollAnswer[0].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // AND vote create another vote in less then 1 minute
    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[0].uid}/answers/${testPollAnswer[0].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    // Then catch error
    expect(response.body.message).toEqual('Not ready yet...')
    expect(response.body.code).toBe(400019)
  })

  test('Update to another answer when DISCUSSION status. Successfully', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const voterSeed = VoteServiceImpl.prototype['generateVoterSeed'].bind({ secret: 'secret' })(
      testPollsList[0].uid,
      publicUserData.uid,
    )

    await knex<Vote>('vote').insert({
      votingRoundUID: testPollsList[0].uid,
      voterSeed,
      roundStatus: VotingRoundType.DISCUSSION,
      ageGroup: AgeGroup.THIRTY_FIVE,
      gender: Gender.FEMALE,
      socialStatus: SocialStatus.CLERK,
      addressRegion: Region.CHERKASY_REGION,
      createdAt: DateUtility.fromISO('2019-02-01'),
    })

    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[0].uid}/answers/${testPollAnswer[0].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    expect(response.status).toBe(201)

    const votes = await knex<Vote>('vote').select('*')
    expect(votes.length).toBe(1)
    expect(votes[0].pollAnswerUID).toEqual(testPollAnswer[0].uid)
    expect(votes[0].roundStatus).toEqual(VotingRoundType.DISCUSSION)
  })

  test('Update to another answer when VOTING status. Successfully', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const voterSeed = VoteServiceImpl.prototype['generateVoterSeed'].bind({ secret: 'secret' })(
      testPollsList[1].uid,
      publicUserData.uid,
    )

    await knex<Vote>('vote').insert({
      votingRoundUID: testPollsList[1].uid,
      voterSeed,
      roundStatus: VotingRoundType.DISCUSSION,
      ageGroup: AgeGroup.THIRTY_FIVE,
      gender: Gender.FEMALE,
      socialStatus: SocialStatus.CLERK,
      addressRegion: Region.CHERKASY_REGION,
      createdAt: DateUtility.fromISO('2019-02-01'),
    })

    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[1].uid}/answers/${testPollAnswer[1].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    expect(response.status).toBe(201)

    const votes = await knex<Vote>('vote').select('*')
    expect(votes.length).toBe(1)
    expect(votes[0].pollAnswerUID).toEqual(testPollAnswer[1].uid)
    expect(votes[0].roundStatus).toEqual(VotingRoundType.VOTING)
  })

  test('Update to another answer when VOTING status. Failed already exist', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const voterSeed = VoteServiceImpl.prototype['generateVoterSeed'].bind({ secret: 'secret' })(
      testPollsList[1].uid,
      publicUserData.uid,
    )

    await knex<Vote>('vote').insert({
      votingRoundUID: testPollsList[1].uid,
      voterSeed,
      roundStatus: VotingRoundType.VOTING,
      ageGroup: AgeGroup.THIRTY_FIVE,
      gender: Gender.FEMALE,
      socialStatus: SocialStatus.CLERK,
      addressRegion: Region.CHERKASY_REGION,
      createdAt: DateUtility.fromISO('2019-02-01'),
    })

    const response = await request(TestContext.app)
      .post(`/polls/${testPollsList[1].uid}/answers/${testPollAnswer[1].uid}/votes`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])

    expect(response.body.message).toEqual('Already voted')
    expect(response.body.code).toBe(403002)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
