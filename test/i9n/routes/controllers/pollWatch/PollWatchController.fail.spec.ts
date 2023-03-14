import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import { PollWatchService } from '../../../../../src/iviche/pollWatch/services/PollWatchService'
import { pollWatchSeed } from '../../../../database/seeds/TestPollWatchList'
import { publicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollWatchController fail', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let pollWatchService: PollWatchService

  beforeAll(async done => {
    await TestContext.initialize([pollWatchSeed])
    pollWatchService = container.resolve<PollWatchService>('PollWatchService')
    done()
  })

  test('POST to /poll-watches failed, incorrect PollUID', async () => {
    // GIVEN application, active user credentials and new poll data
    const payload = {
      pollUID: '00000000-baaa-bbbb-cccc-000000000010',
    }
    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/poll-watches')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(payload)

    // THEN response must be Not Found
    expect(response.status).toBe(404)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
