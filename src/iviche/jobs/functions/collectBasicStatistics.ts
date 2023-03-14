import * as Knex from 'knex'

import { EnvironmentMode } from '../../common/EnvironmentMode'
import { Elastic } from '../../elastic/Elastic'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollVotingResultDAOImpl } from '../../polls/db/PollVotingResultDAOImpl'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollService } from '../../polls/services/PollService'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { PollVotingResultService } from '../../polls/services/PollVotingResultService'
import { PollVotingResultServiceImpl } from '../../polls/services/PollVotingResultServiceImpl'
import { GrandAccessACS } from '../../security/acs/strategies'
import { StatisticsHistogram } from '../../statistics/model/StatisticsHistogram'
import { StatisticService } from '../../statistics/service/StatisticService'
import { StatisticServiceImpl } from '../../statistics/service/StatisticServiceImpl'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'
import { VotesCount } from '../../voting/db/VoteDAO'
import { VoteDAOImpl } from '../../voting/db/VoteDAOImpl'
import { VotingRoundDAOImpl } from '../../voting/db/VotingRoundDAOImpl'
import { VoteService } from '../../voting/service/VoteService'
import { VoteServiceImpl } from '../../voting/service/VoteServiceImpl'
import { VotingRoundServiceImpl } from '../../voting/service/VotingRoundServiceImpl'

type CollectorContext = {
  statisticService: StatisticService
  votingResultService: PollVotingResultService
  voteService: VoteService
  pollService: PollService
}

function buildContext(knexConnection: Knex): CollectorContext {
  const pollService = new PollServiceImpl(
    new PollDAOImpl(),
    knexConnection,
    new Elastic(),
    new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
    new PersonDAOImpl(),
  )

  return {
    statisticService: new StatisticServiceImpl(),
    votingResultService: new PollVotingResultServiceImpl(
      new PollVotingResultDAOImpl(),
      knexConnection,
    ),
    voteService: new VoteServiceImpl(
      knexConnection,
      new VoteDAOImpl(),
      new PersonDAOImpl(),
      new VotingRoundServiceImpl(new VotingRoundDAOImpl(), knexConnection),
      pollService,
    ),
    pollService,
  }
}

type PollBasicStatistics = {
  votesCount: number
  answersHistogram: StatisticsHistogram
}

async function collectBasicStatisticsData(
  poll: Record<string, string>,
  context: CollectorContext,
): Promise<PollBasicStatistics> {
  const answersHistogram: StatisticsHistogram = {}
  let totalVotesCount = 0
  const votesCountArray: Array<VotesCount> = await context.voteService.votesCount(poll.uid)

  for (const votesCount of votesCountArray) {
    answersHistogram[votesCount.uid] = votesCount.count
    totalVotesCount += +votesCount.count
  }

  return {
    votesCount: totalVotesCount,
    answersHistogram,
  }
}
async function processPoll(
  poll: Record<string, string>,
  knexConnection: Knex,
  context: CollectorContext,
): Promise<void> {
  if (poll.uid) {
    const { votesCount, answersHistogram } = await collectBasicStatisticsData(poll, context)
    const votingResult = context.statisticService.buildAnswerValueStatistics(
      answersHistogram,
      poll.uid,
    )
    await context.votingResultService.cleanAnswerValueStatistics(poll.uid)
    await context.votingResultService.create([votingResult])
    await context.pollService.partialUpdate(poll.uid, { votesCount }, new GrandAccessACS())
  }
}
// NOTE: export is required for testing with the ability to provide a mock database connection
export const collectBasicStatistics = async (knexConnection: Knex): Promise<void> => {
  let exitCode = 0
  const PROCESS_EXIT_ERROR = -322
  try {
    const context = buildContext(knexConnection)
    const polls = await context.pollService.getPollByStatuses([
      PollStatus.DISCUSSION,
      PollStatus.VOTING,
    ])

    for (const poll of polls) {
      await processPoll(poll, knexConnection, context)
    }
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
