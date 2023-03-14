import { oneLine } from 'common-tags'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { logger } from '../../logger/LoggerFactory'
import { Poll } from '../../polls/models/Poll'
import { PollStatus } from '../../polls/models/PollStatus'
import { VotingRound } from '../model/VotingRound'
import { VotingRoundType } from '../model/VotingRoundType'
import { VotingRoundDAO } from './VotingRoundDAO'

export class VotingRoundDAOImpl implements VotingRoundDAO {
  private async toDiscussion(trxProvider: TrxProvider, poll: Poll): Promise<void> {
    logger.debug('poll.voting-round.dao.to-discussion.start')

    const trx = await trxProvider()

    await trx('voting_round').insert({
      uid: poll.uid,
      type: VotingRoundType.DISCUSSION,
      startedAt: poll.discussionStartAt,
      endedAt: poll.votingStartAt,
      createdAt: DateUtility.now(),
    })

    logger.debug('poll.voting-round.dao.to-discussion.done')
  }

  private async toVoting(trxProvider: TrxProvider, poll: Poll): Promise<void> {
    logger.debug('poll.voting-round.dao.to-voting.start')

    const trx = await trxProvider()

    const voteData: VotingRound = {
      uid: poll.uid,
      type: VotingRoundType.VOTING,
      startedAt: poll.votingStartAt,
      endedAt: poll.votingEndAt,
      createdAt: DateUtility.now(),
    }

    await trx.raw(
      oneLine`
      insert into voting_round ("uid", "type", "startedAt", "endedAt", "createdAt")
      values (?, ?, ?, ?, ?)
      ON CONFLICT (uid) DO update set 
       "type" = EXCLUDED."type",
       "startedAt" = EXCLUDED."startedAt",
       "endedAt" = EXCLUDED."endedAt",
       "createdAt" = EXCLUDED."createdAt"`,
      Object.values(voteData),
    )

    logger.debug('poll.voting-round.dao.to-voting.done')
  }

  public async saveOrUpdateByPollStatus(trxProvider: TrxProvider, poll: Poll): Promise<void> {
    if (poll.status === PollStatus.DISCUSSION) {
      return this.toDiscussion(trxProvider, poll)
    }

    if (poll.status === PollStatus.VOTING) {
      return this.toVoting(trxProvider, poll)
    }
  }

  public async get(trxProvider: TrxProvider, pollUID: string): Promise<VotingRound> {
    logger.debug('poll.voting-round.dao.get.start')

    const trx = await trxProvider()

    const voteRound = await trx('voting_round')
      .select('*')
      .where({ uid: pollUID })
      .first()
    logger.debug('poll.voting-round.dao.get.done')
    return voteRound
  }
}
