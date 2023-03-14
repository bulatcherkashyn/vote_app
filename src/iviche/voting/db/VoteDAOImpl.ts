import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { logger } from '../../logger/LoggerFactory'
import { PollAnswerStatus } from '../../polls/models/PollAnswerStatus'
import { Vote } from '../model/Vote'
import { VoteInfo } from '../model/VotingInfo'
import { VoteDAO, VotesCount } from './VoteDAO'

export class VoteDAOImpl implements VoteDAO {
  async create(trxProvider: TrxProvider, vote: Vote): Promise<void> {
    logger.debug('poll.vote.dao.create.start')

    const trx = await trxProvider()
    await trx<Vote>('vote').insert({
      ...vote,
      createdAt: DateUtility.now(),
    })
    logger.debug('poll.vote.dao.create.done')
  }

  async updatePartial(
    trxProvider: TrxProvider,
    voterSeed: string,
    vote: Partial<Vote>,
  ): Promise<void> {
    logger.debug('poll.vote.dao.partial-update.start')

    const trx = await trxProvider()
    await trx<Vote>('vote')
      .update({
        ...vote,
        createdAt: DateUtility.now(),
      })
      .where({ voterSeed })

    logger.debug('poll.vote.dao.partial-update.done')
  }

  public async getVoteInfo(trxProvider: TrxProvider, uid: string): Promise<VoteInfo | undefined> {
    logger.debug('poll.vote.dao.get-vote-info.start')

    const trx = await trxProvider()

    const result = await trx('vote')
      .where({ voterSeed: uid })
      .select('createdAt', 'pollAnswerUID as answerUid', 'roundStatus as votingRound')
      .first()

    logger.debug('poll.vote.dao.get-vote-info..done')
    return result
  }

  async listByVotingRoundUID(
    trxProvider: TrxProvider,
    votingRoundUID: string,
  ): Promise<Array<Vote>> {
    logger.debug('poll.vote.dao.list.start')

    const trx = await trxProvider()

    const vote = await trx('vote')
      .where({ votingRoundUID: votingRoundUID })
      .select('*')
    logger.debug('poll.vote.dao.list.done')
    return vote
  }

  async getByVoterSeed(trxProvider: TrxProvider, voterSeed: string): Promise<Vote> {
    logger.debug('poll.vote.dao.get.start')

    const trx = await trxProvider()

    const vote = await trx('vote')
      .where({ voterSeed: voterSeed })
      .select('*')
      .first()
    logger.debug('poll.vote.dao.get.done')

    return vote
  }

  public async countVotesPerAnswer(
    trxProvider: TrxProvider,
    pollUID: string,
  ): Promise<Array<VotesCount>> {
    logger.debug('poll.vote.dao.count.start')

    const trx = await trxProvider()

    const query = await trx('poll_answer')
      .leftOuterJoin('vote', 'vote.pollAnswerUID', 'poll_answer.uid')
      .select('poll_answer.uid')
      .where('poll_answer.status', PollAnswerStatus.PUBLISHED)
      .where('poll_answer.pollUID', pollUID)
      .groupBy('poll_answer.uid')
      .count('vote.*')

    const result = query.map(r => {
      return {
        uid: r.uid,
        count: parseInt(r.count as string),
      }
    })
    logger.debug('poll.vote.dao.count.done')
    return result as Array<VotesCount>
  }
}
