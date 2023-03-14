import 'reflect-metadata'

import * as Knex from 'knex'

import { CommentDAOImpl } from '../../comment/db/CommentDAOImpl'
import { CommentEntity } from '../../comment/model/CommentEntity'
import { CommentService } from '../../comment/service/CommentService'
import { CommentServiceImpl } from '../../comment/service/CommentServiceImpl'
import { Elastic } from '../../elastic/Elastic'
import { logger } from '../../logger/LoggerFactory'
import { ModerationDAOImpl } from '../../moderation/db/ModerationDAOImpl'
import { PersonDAOImpl } from '../../person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../polls/db/PollDAOImpl'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollService } from '../../polls/services/PollService'
import { PollServiceImpl } from '../../polls/services/PollServiceImpl'
import { GrandAccessACS } from '../../security/acs/strategies'
import { TelegramBotServiceImpl } from '../../telegram-bot/TelegramBotServiceImpl'

function getPollService(knexConnection: Knex): PollService {
  return new PollServiceImpl(
    new PollDAOImpl(),
    knexConnection,
    new Elastic(),
    new ModerationDAOImpl(new PollDAOImpl(), new TelegramBotServiceImpl()),
    new PersonDAOImpl(),
  )
}

function getCommentService(knexConnection: Knex): CommentService {
  return new CommentServiceImpl(new CommentDAOImpl(), knexConnection)
}

async function updateCommentCountForPoll(knexConnection: Knex, pollUID: string): Promise<void> {
  const commentsService = getCommentService(knexConnection)
  const pollService = getPollService(knexConnection)

  const commentsCount = await commentsService.countComments(pollUID, CommentEntity.POLL)
  await pollService.partialUpdate(pollUID, { commentsCount }, new GrandAccessACS())
}

export const pollCommentCount = async (knexConnection: Knex): Promise<void> => {
  try {
    const pollService = getPollService(knexConnection)
    const polls = await pollService.getPollByStatuses([
      PollStatus.PUBLISHED,
      PollStatus.DISCUSSION,
      PollStatus.VOTING,
      PollStatus.FINISHED,
      PollStatus.COMPLETED,
    ])

    const promises = polls.map(poll => updateCommentCountForPoll(knexConnection, poll.uid))
    await Promise.all(promises)
  } catch (error) {
    knexConnection.destroy()
    logger.error(`poll-comment-count.job.error:`, error)
  }

  knexConnection.destroy()
}
