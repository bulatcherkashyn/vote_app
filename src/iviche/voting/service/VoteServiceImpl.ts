import crypto from 'crypto'
import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { PollUtility } from '../../common/PollUtility'
import { DateUtility } from '../../common/utils/DateUtility'
import { TrxUtility } from '../../db/TrxUtility'
import { ForbiddenErrorCodes, ValidationErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { logger } from '../../logger/LoggerFactory'
import { PersonDAO } from '../../person/db/PersonDAO'
import { Poll } from '../../polls/models/Poll'
import { PollAnswerStatus } from '../../polls/models/PollAnswerStatus'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollType } from '../../polls/models/PollType'
import { PollService } from '../../polls/services/PollService'
import { GrandAccessACS } from '../../security/acs/strategies'
import { VoteDAO, VotesCount } from '../db/VoteDAO'
import { Vote } from '../model/Vote'
import { VoteInfo } from '../model/VotingInfo'
import { VotingRoundType } from '../model/VotingRoundType'
import { VoteService } from './VoteService'
import { VotingRoundService } from './VotingRoundService'

@injectable()
export class VoteServiceImpl implements VoteService {
  private secret = process.env.VOTER_SEED_SECRET || 'secret'

  constructor(
    @inject('DBConnection') protected db: Knex,
    @inject('VoteDAO') protected dao: VoteDAO,
    @inject('PersonDAO') private personDAO: PersonDAO,
    @inject('VotingRoundService') private votingRoundService: VotingRoundService,
    @inject('PollService') private pollService: PollService,
  ) {}

  private async validatePoll(poll: Poll | undefined, answerUID: string): Promise<void> {
    const answer = poll?.answers.find(el => el.uid === answerUID)
    if (!answer || answer.status !== PollAnswerStatus.PUBLISHED) {
      throw new ServerError('Not found', 404)
    }
    const votingRound = await this.votingRoundService.get(poll?.uid as string)

    if (
      (poll?.status !== PollStatus.DISCUSSION && poll?.status !== PollStatus.VOTING) ||
      (poll?.status as string) !== (votingRound.type as string)
    ) {
      throw new ServerError('Forbidden', 403)
    }
  }

  public async create(pollUID: string, answerUID: string, userUID: string): Promise<void> {
    logger.debug('poll.vote.service.create.start')
    const poll = await this.pollService.get(pollUID, new GrandAccessACS())
    await this.validatePoll(poll, answerUID)
    const voterSeed = this.generateVoterSeed(pollUID, userUID)

    return TrxUtility.transactional(this.db, async trxProvider => {
      const vote = await this.dao.getByVoterSeed(trxProvider, voterSeed)

      if (!vote) {
        const person = await this.personDAO.getByUserUID(trxProvider, userUID)

        let newVote: Vote = {
          voterSeed,
          pollAnswerUID: answerUID,
          votingRoundUID: pollUID,
          roundStatus: VotingRoundType.DISCUSSION,
        }

        if (poll?.pollType !== PollType.BLITZ && poll?.pollType !== PollType.RATING_MONITOR) {
          if (!person?.birthdayAt) {
            throw new ServerError('Date of birthday not set', 400)
          }
          const age = new Date().getFullYear() - person.birthdayAt.getFullYear()
          newVote = {
            ...newVote,
            ageGroup: PollUtility.getAgeGroup(age),
            gender: person.gender,
            socialStatus: person.socialStatus,
            addressRegion: person.addressRegion,
            addressDistrict: person.addressDistrict,
            addressTown: person.addressTown,
          }
        }
        return this.dao.create(trxProvider, newVote)
      }

      if (poll?.status === PollStatus.DISCUSSION) {
        const diff = DateUtility.getDateDiff(vote.createdAt as Date, DateUtility.now(), ['minutes'])

        if ((diff.minutes as number) < 1) {
          throw new ServerError('Not ready yet...', 400, ValidationErrorCodes.NOT_READY_YET)
        }
        return this.dao.updatePartial(trxProvider, voterSeed, { pollAnswerUID: answerUID })
      }

      if (vote.roundStatus === VotingRoundType.VOTING) {
        throw new ServerError('Already voted', 403, ForbiddenErrorCodes.ALREADY_VOTED, 'answerUID')
      }

      return this.dao.updatePartial(trxProvider, voterSeed, {
        pollAnswerUID: answerUID,
        roundStatus: VotingRoundType.VOTING,
      })
    })
  }

  public async getVoteInfo(pollUID: string, userUID: string): Promise<VoteInfo | undefined> {
    logger.debug('poll.vote.service.get-vote-info.start')
    const voterSeed = this.generateVoterSeed(pollUID, userUID)

    return await TrxUtility.transactional<VoteInfo | undefined>(this.db, async trxProvider => {
      const vote = await this.dao.getVoteInfo(trxProvider, voterSeed)
      logger.debug('poll.vote.service.get-vote-info.done')
      return vote
    })
  }

  public async list(votingRoundUID: string): Promise<Array<Vote>> {
    logger.debug('poll.vote.service.list.start')
    return TrxUtility.transactional<Array<Vote>>(this.db, async trxProvider => {
      const list = await this.dao.listByVotingRoundUID(trxProvider, votingRoundUID)
      logger.debug('poll.vote.service.list.done')
      return list
    })
  }

  private generateVoterSeed(pollUID: string, userUID: string): string {
    return crypto
      .createHmac('sha256', this.secret)
      .update(pollUID + userUID)
      .digest('hex')
  }

  public votesCount(pollUID: string): Promise<Array<VotesCount>> {
    logger.debug('poll.vote.service.list.start')
    return TrxUtility.transactional<Array<VotesCount>>(this.db, async trxProvider => {
      const list = await this.dao.countVotesPerAnswer(trxProvider, pollUID)
      logger.debug('poll.vote.service.list.done')
      return list
    })
  }
}
