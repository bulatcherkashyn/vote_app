import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'

import { Elastic } from '../../../../../src/iviche/elastic/Elastic'
import { ModerationResolutionType } from '../../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolve } from '../../../../../src/iviche/moderation/model/ModerationResolve'
import { PollIndex } from '../../../../../src/iviche/polls/models/PollIndex'
import { PollStatus } from '../../../../../src/iviche/polls/models/PollStatus'
import { testModerationSeed } from '../../../../database/seeds/TestModerationList'
import {
  pollModerationSeed,
  testPollsList,
} from '../../../../database/seeds/TestPollsListModeration'
import { sleep } from '../../../../unit/utility/sleep'
import { moderatorData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('PollController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([testModerationSeed, pollModerationSeed])
    await sleep(5000)
    done()
  })

  test('GET to /polls after publishing successfully with new poll', async () => {
    // GIVEN application, superuser credentials and new moderation data
    const targetPollUID = testPollsList[1].uid
    const moderationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      resolution: ModerationResolutionType.APPROVED,
      concern: 'updated',
      lockingCounter: 0,
    }

    const elastic = container.resolve<Elastic>('Elastic')
    let elasticPolls = await elastic.search<PollIndex>('poll')
    const pollFromElasticBefore = elasticPolls.hits.find(
      item => item['_id'] === targetPollUID,
    ) as NonNullable<undefined>
    expect(pollFromElasticBefore['_source']['status']).toBe(PollStatus.MODERATION)

    // WHEN PUT to /moderation-cases/:uid is done
    const response = await request(TestContext.app)
      .put('/moderation-cases/00000000-aaaa-aaaa-cccc-000000000001')
      .set('Cookie', [`token=${moderatorData.jwtToken}`])
      .send(moderationCase)
    expect(response.status).toBe(200)
    await sleep(5000)

    // THEN PollStatus in Elastic Search changes from MODERATION to PUBLISHED immediately
    elasticPolls = await elastic.search<PollIndex>('poll')
    const pollFromElasticAfter = elasticPolls.hits.find(
      item => item['_id'] === targetPollUID,
    ) as NonNullable<undefined>

    expect(pollFromElasticAfter['_source']['status']).toBe(PollStatus.PUBLISHED)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
