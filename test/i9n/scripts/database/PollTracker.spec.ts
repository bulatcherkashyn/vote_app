import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { pollTracker } from '../../../../src/iviche/jobs/functions/pollTracker'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { RatingMonitor } from '../../../../src/iviche/ratingMonitor/models/RatingMonitor'
import { VotingRoundType } from '../../../../src/iviche/voting/model/VotingRoundType'
import { publicUserData, regularUserData } from '../../common/TestUtilities'
import { TestContext } from '../../context/TestContext'

describe('PollTrackerJob', () => {
  beforeAll(async done => {
    await TestContext.initialize()

    done()
  })

  beforeEach(async done => {
    const knex = container.resolve<Knex>('DBConnection')
    await knex('poll').del()
    await knex('index_task').del()
    done()
  })

  test('toDiscussion', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN 3 Polls in db with one correct
    await knex<Poll>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000001',
        status: PollStatus.MODERATION,
        complexWorkflow: true,
        discussionStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingStartAt: DateUtility.fromISO('2020-03-02T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000002',
        status: PollStatus.PUBLISHED,
        complexWorkflow: true,
        discussionStartAt: DateUtility.fromISO('2120-01-02T12:10:00.000Z'),
        votingStartAt: DateUtility.fromISO('2120-03-02T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000003',
        status: PollStatus.PUBLISHED,
        complexWorkflow: true,
        discussionStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingStartAt: DateUtility.fromISO('2050-03-03T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000004',
        status: PollStatus.PUBLISHED,
        complexWorkflow: false,
        discussionStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingStartAt: DateUtility.fromISO('2050-03-03T12:10:00.000Z'),
        pollType: PollType.BLITZ,
      },
    ])

    // WHEN exec our poll tracker
    await pollTracker(new DBConnection().getConnection())

    // THEN Only 1 poll should have discussion status
    const discussionPolls = await knex('poll').where({ status: PollStatus.DISCUSSION })
    expect(discussionPolls.length).toBe(1)
    // AND created a voting round with DISCUSSION type
    const votingRound = await knex('voting_round').where({ type: VotingRoundType.DISCUSSION })
    expect(votingRound.length).toBe(1)
    expect(votingRound[0].uid).toEqual('00000000-baaa-bbbb-cccc-000000000003')
    expect(votingRound[0].type).toEqual(PollStatus.DISCUSSION)
    expect(votingRound[0].startedAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(votingRound[0].endedAt).toEqual(DateUtility.fromISO('2050-03-03T12:10:00.000Z'))

    const indexTasks = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(1)
  })

  test('toVoting', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN 5 Polls in db with 2 correct
    await knex<Poll>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000004',
        status: PollStatus.MODERATION,
        complexWorkflow: true,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2020-03-02T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000005',
        status: PollStatus.PUBLISHED,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2120-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2120-03-02T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000006',
        status: PollStatus.PUBLISHED,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2020-03-02T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000007',
        status: PollStatus.DISCUSSION,
        complexWorkflow: true,
        votingStartAt: DateUtility.fromISO('2050-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2050-03-03T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000008',
        status: PollStatus.DISCUSSION,
        complexWorkflow: true,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2020-03-03T12:10:00.000Z'),
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000009',
        status: PollStatus.PUBLISHED,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: DateUtility.fromISO('2020-03-02T12:10:00.000Z'),
        pollType: PollType.BLITZ,
      },
    ])
    await knex<RatingMonitor>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000010',
        status: PollStatus.DISCUSSION,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: undefined,
        pollType: PollType.RATING_MONITOR,
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000011',
        status: PollStatus.DISCUSSION,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-03T12:10:00.000Z'),
        votingEndAt: undefined,
        pollType: PollType.RATING_MONITOR,
      },
    ])

    // WHEN exec our poll tracker
    await pollTracker(new DBConnection().getConnection())

    // THEN 2 polls should have discussion status
    const discussionPolls = await knex('poll').where({ status: PollStatus.VOTING })
    expect(discussionPolls.length).toBe(3)
    // AND created a voting round with VOTING type
    const votingRound = await knex('voting_round').where({ type: VotingRoundType.VOTING })
    expect(votingRound.length).toBe(3)

    expect(votingRound[0].uid).toEqual('00000000-baaa-bbbb-cccc-000000000006')
    expect(votingRound[0].type).toEqual(PollStatus.VOTING)
    expect(votingRound[0].startedAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(votingRound[0].endedAt).toEqual(DateUtility.fromISO('2020-03-02T12:10:00.000Z'))

    expect(votingRound[1].uid).toEqual('00000000-baaa-bbbb-cccc-000000000008')
    expect(votingRound[1].type).toEqual(PollStatus.VOTING)
    expect(votingRound[1].startedAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(votingRound[1].endedAt).toEqual(DateUtility.fromISO('2020-03-03T12:10:00.000Z'))

    expect(votingRound[2].uid).toEqual('00000000-baaa-bbbb-cccc-000000000009')
    expect(votingRound[2].type).toEqual(PollStatus.VOTING)
    expect(votingRound[2].startedAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(votingRound[2].endedAt).toEqual(DateUtility.fromISO('2020-03-02T12:10:00.000Z'))

    const indexTasks = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(3)

    const ratingMonitors = await knex('poll').where({ pollType: PollType.RATING_MONITOR })
    expect(ratingMonitors.length).toBe(2)
    expect(ratingMonitors[0].uid).toEqual('00000000-baaa-bbbb-cccc-000000000010')
    expect(ratingMonitors[0].votingStartAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(ratingMonitors[0].votingEndAt).toEqual(null)
    expect(ratingMonitors[0].status).toEqual(PollStatus.DISCUSSION)
    expect(ratingMonitors[1].uid).toEqual('00000000-baaa-bbbb-cccc-000000000011')
    expect(ratingMonitors[1].votingStartAt).toEqual(DateUtility.fromISO('2020-01-03T12:10:00.000Z'))
    expect(ratingMonitors[1].votingEndAt).toEqual(null)
    expect(ratingMonitors[1].status).toEqual(PollStatus.DISCUSSION)
  })

  test('toFinished', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    // GIVEN 3 Polls in db with one correct
    await knex<Poll>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000009',
        status: PollStatus.MODERATION,
        votingEndAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        authorUID: publicUserData.uid,
        title: 'Title for 009',
        body: 'Body for 009',
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000010',
        status: PollStatus.VOTING,
        votingEndAt: DateUtility.fromISO('2120-01-02T12:10:00.000Z'),
        authorUID: publicUserData.uid,
        title: 'Title for 010',
        body: 'Body for 010',
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000011',
        status: PollStatus.VOTING,
        votingEndAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        authorUID: regularUserData.uid,
        title: 'Title for 011',
        body: 'Body for 011',
      },
    ])

    await knex<RatingMonitor>('poll').insert([
      {
        uid: '00000000-baaa-bbbb-cccc-000000000012',
        status: PollStatus.DISCUSSION,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-02T12:10:00.000Z'),
        votingEndAt: undefined,
        pollType: PollType.RATING_MONITOR,
      },
      {
        uid: '00000000-baaa-bbbb-cccc-000000000013',
        status: PollStatus.DISCUSSION,
        complexWorkflow: false,
        votingStartAt: DateUtility.fromISO('2020-01-03T12:10:00.000Z'),
        votingEndAt: undefined,
        pollType: PollType.RATING_MONITOR,
      },
    ])

    // WHEN exec our poll tracker
    await pollTracker(new DBConnection().getConnection())

    // THEN Only 1 poll should have discussion status
    const discussionPolls = await knex('poll').where({ status: PollStatus.FINISHED })
    expect(discussionPolls.length).toBe(1)

    const ratingMonitors = await knex('poll').where({ pollType: PollType.RATING_MONITOR })
    expect(ratingMonitors.length).toBe(2)
    expect(ratingMonitors[0].uid).toEqual('00000000-baaa-bbbb-cccc-000000000012')
    expect(ratingMonitors[0].votingStartAt).toEqual(DateUtility.fromISO('2020-01-02T12:10:00.000Z'))
    expect(ratingMonitors[0].votingEndAt).toEqual(null)
    expect(ratingMonitors[0].status).toEqual(PollStatus.DISCUSSION)
    expect(ratingMonitors[1].uid).toEqual('00000000-baaa-bbbb-cccc-000000000013')
    expect(ratingMonitors[1].votingStartAt).toEqual(DateUtility.fromISO('2020-01-03T12:10:00.000Z'))
    expect(ratingMonitors[1].votingEndAt).toEqual(null)
    expect(ratingMonitors[1].status).toEqual(PollStatus.DISCUSSION)

    const indexTasks = await knex('index_task').select('*')
    expect(indexTasks.length).toBe(1)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
