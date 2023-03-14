import 'reflect-metadata'

import * as Knex from 'knex'

import { EnvironmentMode } from '../../common/EnvironmentMode'
import { TrxUtility } from '../../db/TrxUtility'
import { Elastic } from '../../elastic/Elastic'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { NotificationStorageServiceImpl } from '../../notificationStorage/services/NotificationStorageServiceImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollVotingResultDAOImpl } from '../../polls/db/PollVotingResultDAOImpl'
import { Poll } from '../../polls/models/Poll'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollType } from '../../polls/models/PollType'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { PollVotingResultServiceImpl } from '../../polls/services/PollVotingResultServiceImpl'
import { FirebasePushNotificationService } from '../../pushNotification/services/FirebasePushNotificationService'
import { GrandAccessACS } from '../../security/acs/strategies'
import { AuthDAOImpl } from '../../security/auth/db/AuthDAOImpl'
import { AuthNotificationServiceImpl } from '../../security/auth/services/AuthNotificationServiceImpl'
import { StatisticServiceImpl } from '../../statistics/service/StatisticServiceImpl'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'
import { VoteDAOImpl } from '../../voting/db/VoteDAOImpl'
import { VotingRoundDAOImpl } from '../../voting/db/VotingRoundDAOImpl'
import { Vote } from '../../voting/model/Vote'
import { VotingRound } from '../../voting/model/VotingRound'
import { VoteServiceImpl } from '../../voting/service/VoteServiceImpl'
import { VotingRoundServiceImpl } from '../../voting/service/VotingRoundServiceImpl'

// NOTE: export is required for testing with the ability to provide a mock database connection
export const collectVotingResults = async (knexConnection: Knex): Promise<void> => {
  let exitCode = 0
  const PROCESS_EXIT_ERROR = -322

  try {
    const statisticService = new StatisticServiceImpl()
    const votingResultService = new PollVotingResultServiceImpl(
      new PollVotingResultDAOImpl(),
      knexConnection,
    )

    const pollService = new PollServiceImpl(
      new PollDAOImpl(),
      knexConnection,
      new Elastic(),
      new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
      new PersonDAOImpl(),
    )
    const votingRoundService = new VotingRoundServiceImpl(new VotingRoundDAOImpl(), knexConnection)
    const voteService = new VoteServiceImpl(
      knexConnection,
      new VoteDAOImpl(),
      new PersonDAOImpl(),
      votingRoundService,
      pollService,
    )
    const pushNotificationService = new FirebasePushNotificationService(
      pollService,
      new AuthNotificationServiceImpl(knexConnection, new AuthDAOImpl()),
      new NotificationStorageServiceImpl(new Elastic()),
    )
    // FIXME Rewrite/remove this after implementation of new notification module
    // NOTE completed poll uids for notification
    const completedPollUIDs: Array<string> = []
    await TrxUtility.transactional(knexConnection, async trxProvider => {
      const trx = await trxProvider()
      const polls = await trx('poll')
        .select('uid', 'pollType')
        .where({ status: PollStatus.FINISHED })

      for (const poll of polls) {
        const votingResult = []
        if (poll.uid && poll.pollType === PollType.REGULAR) {
          const votingRound: VotingRound = await votingRoundService.get(poll.uid)
          if (votingRound.uid) {
            const votes: Array<Vote> = await voteService.list(votingRound.uid)

            const statisticsResult = statisticService.getVotingResults(poll.uid, votes)
            if (statisticsResult.VOTES_DYNAMICS && statisticsResult.RESULTS_GEOGRAPHY) {
              votingResult.push(...statisticsResult.RESULTS_GEOGRAPHY)
              votingResult.push(...statisticsResult.VOTES_DYNAMICS)
            }
            await votingResultService.create(votingResult)
            const newPoll: Partial<Poll> = {
              status: PollStatus.COMPLETED,
            }
            completedPollUIDs.push(poll.uid)
            await pollService.partialUpdate(poll.uid, newPoll, new GrandAccessACS())
          }
        }
      }
    })
    // FIXME Rewrite/remove this after implementation of new notification module
    // NOTE PUSH_NOTIFICATION send notification to author of polls
    await pushNotificationService.sendNotificationChangePollStatus(completedPollUIDs)

    process.send && process.send({ hasError: false })
  } catch (error) {
    exitCode = PROCESS_EXIT_ERROR
    await knexConnection.destroy()
    process.send && process.send({ hasError: true, result: error.message })
  } finally {
    if (!EnvironmentMode.isTest()) {
      process.exit(exitCode)
    }
    await knexConnection.destroy()
  }
}
