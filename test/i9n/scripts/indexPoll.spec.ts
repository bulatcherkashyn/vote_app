import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { indexPolls } from '../../../database/indexPolls'
import { Theme } from '../../../src/iviche/common/Theme'
import { DBConnection } from '../../../src/iviche/db/DBConnection'
import { Poll } from '../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { TestContext } from '../context/TestContext'

describe('indexPolls script', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('indexPolls', async () => {
    const knex = container.resolve<Knex>('DBConnection')

    // GIVEN 1 poll
    const poll = {
      uid: '00000000-baaa-bbbb-cccc-000000000001',
      status: PollStatus.MODERATION,
      body: 'Somebody',
      theme: Theme.BUSINESS,
      title: '4Head',
      complexWorkflow: true,
      authorUID: '00000000-aaaa-aaaa-aaaa-000000000001',
    }
    await knex<Poll>('poll').insert(poll)

    // AND index_task queue should be empty
    const initTasks = await knex('index_task').select('*')
    expect(initTasks.length).toBe(0)

    // WHEN start indexPolls script
    await indexPolls(new DBConnection().getConnection())

    // THEN got 1 task in queue
    const tasks = await knex('index_task').select('*')
    expect(tasks.length).toBe(1)

    expect(tasks[0].referenceUID).toEqual(poll.uid)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
