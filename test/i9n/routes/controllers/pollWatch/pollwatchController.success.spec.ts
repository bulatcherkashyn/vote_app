import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import { PollWatchService } from '../../../../../src/iviche/pollWatch/services/PollWatchService'
import { pollWatchSeed, testPollWatchList } from '../../../../database/seeds/TestPollWatchList'
import { publicUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollWatchController successful', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let pollWatchService: PollWatchService

  beforeAll(async done => {
    await TestContext.initialize([pollWatchSeed])
    pollWatchService = container.resolve<PollWatchService>('PollWatchService')
    done()
  })

  test('GET to /poll-watches successfully', async () => {
    // GIVEN application

    const response = await request(TestContext.app)
      .get('/poll-watches')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
    // THEN response must be Created
    expect(response.status).toBe(200)
    // AND body.list should contain paginated list
    expect(response.body.list.length).toBe(1)
    expect(response.body.list[0].uid).toBe(testPollWatchList[4].uid)
  })

  test('POST to /poll-watches successfully', async () => {
    // GIVEN application, active user credentials and new poll data
    const payload = {
      pollUID: '00000000-baaa-bbbb-cccc-000000000001',
    }

    // WHEN POST to /polls is done
    const response = await request(TestContext.app)
      .post('/poll-watches')
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
      .send(payload)

    // THEN response must be Created
    expect(response.status).toBe(200)
    // AND body should contain new poll's uid
    expect(typeof response.body).toBe('string')
    expect(response.body).toHaveLength(36)
  })

  test('DELETE to /poll-watches successfully', async () => {
    // GIVEN application and test pollWatch uid
    // WHEN DELETE to /polls is done
    const response = await request(TestContext.app)
      .delete(`/poll-watches/${testPollWatchList[0].uid}`)
      .set('Cookie', [`token=${publicUserData.jwtToken}`])
    // THEN response must be Created
    expect(response.status).toBe(200)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
