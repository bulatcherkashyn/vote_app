import 'reflect-metadata'

import request from 'supertest'

import {
  pollModerationSeed,
  testModerationArray,
  testPollAnswer,
  testPollsList,
  testVoteList,
} from '../../../../database/seeds/TestPollsListModeration'
import { veryfiedPublicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([pollModerationSeed])
    done()
  })

  test('GET to /polls/:pollId successfully with moderation, voting, answer Info', async () => {
    // GIVEN application and administrator credentials
    // WHEN request is done to /polls/:pollId url
    const response = await request(TestContext.app)
      .get(`/polls/${testPollsList[5].uid}`)
      .set('Cookie', [`token=${veryfiedPublicUserData.jwtToken}`])

    // THEN response must be successful
    expect(response.status).toBe(200)

    expect(response.body.title).toBe(testPollsList[5].title)
    const answerInfo = response.body.answerInfo
    expect(answerInfo.uid).toBe(testPollAnswer[13].uid)

    const voteInfo = response.body.voteInfo
    expect(voteInfo.answerUid).toBe(testVoteList[1].pollAnswerUID)

    const moderationInfo = response.body.moderationInfo
    expect(moderationInfo.concern).toBe(testModerationArray[0].concern)
    expect(moderationInfo.summary).toBe(testModerationArray[0].summary)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
