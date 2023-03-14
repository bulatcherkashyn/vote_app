import 'reflect-metadata'

import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { UserRole } from '../../../common/UserRole'
import { UUIDValidator } from '../../../common/validators/UUIDValidator'
import { validate } from '../../../common/validators/ValidationMiddleware'
import {
  ForbiddenErrorCodes,
  NotFoundErrorCodes,
  ValidationErrorCodes,
} from '../../../error/DetailErrorCodes'
import { ServerError } from '../../../error/ServerError'
import { ConstructFrom } from '../../../generic/model/ConstructSingleFieldObject'
import { SingleFieldObjectConstructor } from '../../../generic/utils/SingleFieldObjectConstructor'
import { logger } from '../../../logger/LoggerFactory'
import { ModerationType } from '../../../moderation/model/ModerationType'
import { ModerationService } from '../../../moderation/service/ModerationService'
import { Poll } from '../../../polls/models/Poll'
import { PollAnswerStatus } from '../../../polls/models/PollAnswerStatus'
import { PollDTOView } from '../../../polls/models/PollDTOView'
import { PollStatus } from '../../../polls/models/PollStatus'
import { PollType } from '../../../polls/models/PollType'
import { PollService } from '../../../polls/services/PollService'
import { PollVotingResultService } from '../../../polls/services/PollVotingResultService'
import { PollAnswerValidator } from '../../../polls/validators/PollAnswerValidator'
import { PollQueryListValidator } from '../../../polls/validators/PollQueryListValidator'
import { PollValidator } from '../../../polls/validators/PollValidator'
import { PollWatchService } from '../../../pollWatch/services/PollWatchService'
import { RatingMonitorService } from '../../../ratingMonitor/services/RatingMonitorService'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { ACS } from '../../../security/acs/models/ACS'
import { GrandAccessACS } from '../../../security/acs/strategies'
import { User } from '../../../users/models/User'
import { VoteService } from '../../../voting/service/VoteService'
import { Controller } from '../Controller'
import { PollWatchModelConstructor } from '../pollWatch/PollWatchModelConstructor'
import { AnswerModelConstructor } from './AnswerModelConstuctor'
import { PollListFilterConstructor } from './PollListFilterConstructor'
import { PollModelConstructor } from './PollModelConstructor'

@injectable()
export class PollController implements Controller {
  private modelConstructor: PollModelConstructor = new PollModelConstructor()
  private validator: PollValidator = new PollValidator()
  private listValidator = new PollQueryListValidator()
  private listModelConstructor = new PollListFilterConstructor()
  private answerModelConstructor = new AnswerModelConstructor()
  private answerValidator = new PollAnswerValidator()
  private uuidValidator = new UUIDValidator('pollId')
  private uuidModelConstructor = new SingleFieldObjectConstructor('pollId', ConstructFrom.PARAMS)
  private pollWatchModelConstructor = new PollWatchModelConstructor()

  constructor(
    @inject('PollService') private pollService: PollService,
    @inject('RatingMonitorService') private readonly ratingMonitorService: RatingMonitorService,
    @inject('PollVotingResultService') private pollStatisticService: PollVotingResultService,
    @inject('ModerationService') private moderationService: ModerationService,
    @inject('VoteService') private voteService: VoteService,
    @inject('PollWatchService') private pollWatchService: PollWatchService,
  ) {}

  public path(): string {
    return '/polls'
  }

  public initialize(router: Router): void {
    router.get(
      '/',
      verifyAccess('get_poll'),
      validate(this.listModelConstructor, this.listValidator),
      this.listPolls,
    )
    router.get('/:pollId', verifyAccess('get_poll'), this.loadPoll)
    router.post(
      '/',
      verifyAccess('save_poll'),
      validate(this.modelConstructor, this.validator),
      this.createPoll,
    )
    router.put(
      '/:pollId',
      verifyAccess('update_poll'),
      validate(this.modelConstructor, this.validator),
      this.updatePoll,
    )
    router.delete('/:pollId', verifyAccess('delete_poll'), this.deletePoll)
    router.get('/:pollId/statistics', this.votingResultsList)
    router.post(
      '/:pollId/answers',
      verifyAccess('add_own_answer'),
      validate(this.answerModelConstructor, this.answerValidator),
      this.addPollAnswer,
    )

    router.post(
      '/:pollId/answers/:pollAnswerUid/votes',
      verifyAccess('create_vote'),
      validate(this.uuidModelConstructor, this.uuidValidator),
      this.createVote,
    )

    router.post('/:pollId/hide', verifyAccess('hide_poll'), this.hidePoll)

    router.post('/:pollId/stop', verifyAccess('stop_rating_monitor'), this.stopRatingMonitor)
  }

  public addPollAnswer = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.add-poll-answers.start')
    const answer = this.answerModelConstructor.constructPureObject(request)

    const uid = await this.pollService.savePollAnswer(answer, request.accessRules)

    logger.debug('poll.controller.add-poll-answer.pollWatch.create.start')
    const pollWatch = this.pollWatchModelConstructor.constructPureObjectWithUID(
      request,
      answer.pollUID,
    )
    await this.pollWatchService.save(pollWatch, request.accessRules)
    logger.debug('poll.controller.add-poll-answer.pollWatch.create.done')

    response.status(201).json({ uid })
    logger.debug('poll.controller.add-poll-answers.done')
  }

  public listPolls = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.filtered-list.start')

    const queryParams = this.listModelConstructor.constructPureObject(request)

    const poll = await this.pollService.list(queryParams, request.accessRules)

    response.json(poll)
    logger.debug('poll.controller.filtered-list.done')
  }

  public createPoll = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.create.start')
    const draft = request.query.draft === 'true'
    const poll = this.modelConstructor.constructPureObject(request)
    // TODO try to improve this condition
    if (
      (poll.pollType === PollType.BLITZ &&
        !(
          request.user?.role === UserRole.ADMINISTRATOR ||
          request.user?.role === UserRole.LEGAL ||
          request.user?.role === UserRole.PRIVATE
        )) ||
      (poll.pollType === PollType.RATING_MONITOR && request.user?.role !== UserRole.ADMINISTRATOR)
    ) {
      throw new ServerError(
        'Access denied',
        403,
        ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
        'save-poll',
      )
    }

    if (poll.pollType === PollType.BLITZ && poll.complexWorkflow) {
      throw new ServerError(
        'Blitz poll cannot have DISCUSSION status',
        403,
        ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
        'save-poll',
      )
    }

    if (poll.pollType === PollType.RATING_MONITOR && !draft && !poll.image) {
      throw new ServerError(
        'Missing image. Image is a mandatory field for RATING MONITOR.',
        403,
        ValidationErrorCodes.IMAGE_MISSING_ERROR,
        'save-poll',
      )
    }

    const uid = await this.savePoll(poll, draft, request.accessRules)

    response.status(201).json({ uid })
    logger.debug('poll.controller.create.done')
  }

  private async savePoll(poll: Poll, draft: boolean, acs: ACS): Promise<string> {
    if (poll.pollType === PollType.RATING_MONITOR) {
      return this.ratingMonitorService.savePoll(poll, draft, acs)
    }
    return this.pollService.savePoll(poll, draft, acs)
  }

  public loadPoll = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.load.start')
    const poll = await this.pollService.get(request.params.pollId, request.accessRules)
    const user = request.user as User

    const authorCondition = poll?.authorUID !== user?.uid && poll?.isHidden
    const moderatorCondition =
      user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMINISTRATOR

    if (!poll?.uid || (authorCondition && !moderatorCondition)) {
      throw new ServerError(
        'Poll cannot be found',
        404,
        NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
        'poll',
      )
    }

    let result: PollDTOView = { ...poll }
    if (poll?.status === PollStatus.REJECTED) {
      const moderationCase = await this.moderationService.getModerationResult(
        poll.uid,
        ModerationType.POLL,
      )
      result = {
        ...poll,
        moderationInfo: {
          summary: moderationCase.summary,
          concern: moderationCase.concern as string,
          resolvedAt: moderationCase.resolvedAt as Date,
        },
      }
    }

    if (request.user?.uid !== UserRole.ANONYMOUS) {
      const answerInfo = await this.pollService.getPollAnswerInfo(poll.uid, request.user?.uid)
      if (answerInfo?.status === PollAnswerStatus.REJECTED) {
        const moderationCase = await this.moderationService.getModerationResult(
          answerInfo.uid as string,
          ModerationType.POLL_ANSWER,
        )
        result = {
          ...result,
          moderationInfo: {
            summary: moderationCase.summary,
            concern: moderationCase.concern as string,
            resolvedAt: moderationCase.resolvedAt as Date,
          },
        }
      }
      const voteInfo = await this.voteService.getVoteInfo(poll.uid, request.user?.uid)
      result = { ...result, voteInfo, answerInfo }
    }

    response.json(result)
    logger.debug('poll.controller.load.done')
  }

  public updatePoll = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.update.start')
    const draft = request.query.draft === 'true'
    const poll = this.modelConstructor.constructPureObject(request)

    if (poll.pollType === PollType.BLITZ && poll.complexWorkflow) {
      throw new ServerError(
        'Blitz poll cannot have DISCUSSION status',
        403,
        ForbiddenErrorCodes.POLL_STATUS_FORBIDDEN_ERROR,
        'save-poll',
      )
    }

    if (poll.pollType === PollType.RATING_MONITOR && !draft && !poll.image) {
      throw new ServerError(
        'Missing image. Image is a mandatory field for RATING MONITOR.',
        403,
        ValidationErrorCodes.IMAGE_MISSING_ERROR,
        'save-poll',
      )
    }

    await this.savePoll(poll, draft, request.accessRules)

    response.status(204).send()
    logger.debug('poll.controller.update.done')
  }

  public deletePoll = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.delete.start')

    await this.pollService.delete(request.params.pollId, request.accessRules)

    response.status(204).send()
    logger.debug('poll.controller.delete.done')
  }

  public votingResultsList = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.statistics.start')
    const votingResults = await this.pollStatisticService.list(request.params.pollId)

    if (votingResults.size === 0) {
      throw new ServerError(
        'Statistics for poll ' + request.params.pollId + ' is empty',
        400,
        ValidationErrorCodes.POLL_NOT_COMPLETED,
        'poll',
      )
    }

    response.json(votingResults)
    logger.debug('poll.controller.statistics.done')
  }

  public createVote = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.vote.start')
    const { pollId, pollAnswerUid } = request.params
    const user = request.user as User
    await this.voteService.create(pollId, pollAnswerUid, user.uid as string)

    logger.debug('poll.controller.vote.pollWatch.create.start')
    const pollWatch = this.pollWatchModelConstructor.constructPureObjectWithUID(request, pollId)
    await this.pollWatchService.save(pollWatch, new GrandAccessACS())
    logger.debug('poll.controller.vote.pollWatch.create.done')

    response.status(201).send()

    logger.debug('poll.controller.vote.done')
  }

  public hidePoll = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.hide-poll.start')
    const { pollId } = request.params

    await this.pollService.hidePoll(pollId)

    response.status(200).send()

    logger.debug('poll.controller.hide-poll.done')
  }

  public stopRatingMonitor = async (request: Request, response: Response): Promise<void> => {
    logger.debug('poll.controller.stop-rating-monitor.start')
    const { pollId } = request.params
    await this.ratingMonitorService.stopRatingMonitor(pollId)

    response.status(200).send()

    logger.debug('poll.controller.stop-rating-monitor.done')
  }
}
