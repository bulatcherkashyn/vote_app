import 'reflect-metadata'

import { oneLine } from 'common-tags'
import * as Knex from 'knex'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { Elastic } from '../../elastic/Elastic'
import { IndexTaskQueueDAO } from '../../indexTaskQueue/db/IndexTaskQueueDAO'
import { IndexTaskQueueDAOImpl } from '../../indexTaskQueue/db/IndexTaskQueueDAOImpl'
import { Action, IndexTask, ReferenceType } from '../../indexTaskQueue/model/IndexTask'
import { logger } from '../../logger/LoggerFactory'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { NotificationStorageServiceImpl } from '../../notificationStorage/services/NotificationStorageServiceImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { FirebasePushNotificationService } from '../../pushNotification/services/FirebasePushNotificationService'
import { PushNotificationService } from '../../pushNotification/services/PushNotificationService'
import { AuthDAOImpl } from '../../security/auth/db/AuthDAOImpl'
import { AuthNotificationServiceImpl } from '../../security/auth/services/AuthNotificationServiceImpl'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'
import { VotingRound } from '../../voting/model/VotingRound'
import { VotingRoundType } from '../../voting/model/VotingRoundType'

type PollTrackerContext = {
  indexTaskQueue: IndexTaskQueueDAO
  pushNotificationService: PushNotificationService
}

function buildContext(knexConnection: Knex): PollTrackerContext {
  const elastic = new Elastic()
  const pollService = new PollServiceImpl(
    new PollDAOImpl(),
    knexConnection,
    elastic,
    new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
    new PersonDAOImpl(),
  )

  return {
    indexTaskQueue: new IndexTaskQueueDAOImpl(),
    pushNotificationService: new FirebasePushNotificationService(
      pollService,
      new AuthNotificationServiceImpl(knexConnection, new AuthDAOImpl()),
      new NotificationStorageServiceImpl(elastic),
    ),
  }
}

async function index(
  trxProvider: TrxProvider,
  pollsData: Array<{ uid: string }>,
  context: PollTrackerContext,
): Promise<void> {
  const indexTasks: Array<IndexTask> = pollsData.map(el => ({
    referenceUID: el.uid,
    referenceType: ReferenceType.POLL,
    action: Action.INDEX,
  }))

  await context.indexTaskQueue.createMany(trxProvider, indexTasks)
}

async function toDiscussion(knexConnection: Knex, context: PollTrackerContext): Promise<void> {
  let pollUIDs: Array<string> = []

  await TrxUtility.transactional(knexConnection, async trxProvider => {
    const trx = await trxProvider()
    const updatedToDiscussion = await trx('poll')
      .update({
        status: PollStatus.DISCUSSION,
      })
      .where({ complexWorkflow: true, status: PollStatus.PUBLISHED })
      .where('discussionStartAt', '<=', 'NOW()')
      .returning(['uid', 'discussionStartAt', 'votingStartAt'])

    if (!updatedToDiscussion.length) {
      return
    }
    await index(trxProvider, updatedToDiscussion, context)
    const votingRounds: Array<VotingRound> = updatedToDiscussion.map(updatedPoll => {
      return {
        uid: updatedPoll.uid,
        type: VotingRoundType.DISCUSSION,
        startedAt: updatedPoll.discussionStartAt,
        endedAt: updatedPoll.votingStartAt,
        createdAt: DateUtility.now(),
      }
    })
    await trx('voting_round').insert(votingRounds)

    pollUIDs = updatedToDiscussion.map(poll => poll.uid)
  })

  // FIXME Rewrite/remove this after implementation of new notification module
  if (pollUIDs.length === 0) return
  // NOTE PUSH_NOTIFICATION send notification about new poll for users
  await context.pushNotificationService.sendNotificationAboutNewPoll(pollUIDs)
  // NOTE PUSH_NOTIFICATION send notification to author of polls
  await context.pushNotificationService.sendNotificationChangePollStatus(pollUIDs)
}

async function toVoting(knexConnection: Knex, context: PollTrackerContext): Promise<void> {
  // FIXME Rewrite/remove this after implementation of new notification module
  const pollUIDsOfNewPoll: Array<string> = []
  const pollUIDsForChangeStatusNotification: Array<string> = []

  await TrxUtility.transactional(knexConnection, async trxProvider => {
    const trx = await trxProvider()
    const updatedToVoting = await trx('poll')
      .update({
        status: PollStatus.VOTING,
      })
      .where('votingStartAt', '<=', 'NOW()')
      .andWhereNot({
        pollType: 'RATING_MONITOR',
      })
      .andWhere(function() {
        this.where({ complexWorkflow: true, status: PollStatus.DISCUSSION })
        this.orWhere({ complexWorkflow: false, status: PollStatus.PUBLISHED })
      })
      .returning(['uid', 'complexWorkflow', 'votingStartAt', 'votingEndAt'])

    if (!updatedToVoting.length) {
      return
    }
    await index(trxProvider, updatedToVoting, context)

    const now = DateUtility.now()
    const votingRoundsInsertData = updatedToVoting.reduce((acc, updatedPoll) => {
      const arr = [
        updatedPoll.uid,
        VotingRoundType.VOTING,
        updatedPoll.votingStartAt,
        updatedPoll.votingEndAt,
        now,
      ]
      return [...acc, ...arr]
    }, [])

    const values = new Array(updatedToVoting.length).fill('(?, ?, ?, ?, ?)').join(', ')

    await trx.raw(
      oneLine`
      insert into voting_round ("uid", "type", "startedAt", "endedAt", "createdAt")
      values ${values} 
      ON CONFLICT (uid) DO update set 
       "type" = EXCLUDED."type",
       "startedAt" = EXCLUDED."startedAt",
       "endedAt" = EXCLUDED."endedAt",
       "createdAt" = EXCLUDED."createdAt"`,
      votingRoundsInsertData,
    )

    // FIXME Rewrite/remove this after implementation of new notification module
    updatedToVoting.forEach(poll => {
      if (!poll.complexWorkflow) {
        pollUIDsOfNewPoll.push(poll.uid)
      }
      pollUIDsForChangeStatusNotification.push(poll.uid)
    })
  })

  // FIXME Rewrite/remove this after implementation of new notification module
  if (pollUIDsOfNewPoll.length !== 0) {
    // NOTE PUSH_NOTIFICATION send notification about new poll for users
    await context.pushNotificationService.sendNotificationAboutNewPoll(pollUIDsOfNewPoll)
  }

  // NOTE PUSH_NOTIFICATION send notification to author of polls
  await context.pushNotificationService.sendNotificationChangePollStatus(
    pollUIDsForChangeStatusNotification,
  )
}

async function toFinished(knexConnection: Knex, context: PollTrackerContext): Promise<void> {
  let UIDs: Array<{ uid: string }> = []
  await TrxUtility.transactional(knexConnection, async trxProvider => {
    const trx = await trxProvider()
    UIDs = await trx('poll')
      .update({
        status: PollStatus.FINISHED,
      })
      .where({ status: PollStatus.VOTING })
      .andWhereNot({
        pollType: 'RATING_MONITOR',
      })
      .andWhere('votingEndAt', '<=', 'NOW()')
      .returning(['uid'])

    if (!UIDs.length) {
      return
    }
    await index(trxProvider, UIDs, context)
  })

  if (!UIDs.length) {
    return
  }
  // FIXME Rewrite/remove this after implementation of new notification module
  const pollUIDs: Array<string> = UIDs.map(pollUIDsObject => pollUIDsObject.uid)
  // NOTE PUSH_NOTIFICATION send notification to author of polls
  await context.pushNotificationService.sendNotificationChangePollStatus(pollUIDs)
}

export const pollTracker = async (knexConnection: Knex): Promise<void> => {
  try {
    const context = buildContext(knexConnection)
    const promise = [
      toDiscussion(knexConnection, context),
      toVoting(knexConnection, context),
      toFinished(knexConnection, context),
    ]
    await Promise.all(promise)
  } catch (e) {
    logger.error('poll-tracker-job', e)
  }
  knexConnection.destroy()
}
