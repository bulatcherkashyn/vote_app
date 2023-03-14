import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { TrxUtility } from '../../db/TrxUtility'
import { NotFoundErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { Action, ReferenceType } from '../../indexTaskQueue/model/IndexTask'
import { IndexTaskQueueService } from '../../indexTaskQueue/service/IndexTaskQueueService'
import { logger } from '../../logger/LoggerFactory'
import { PollDAO } from '../../polls/db/PollDAO'
import { Poll } from '../../polls/models/Poll'
import { PollAnswerStatus } from '../../polls/models/PollAnswerStatus'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollType } from '../../polls/models/PollType'
import { PollService } from '../../polls/services/PollService'
import { ProfileDAO } from '../../profiles/db/ProfileDAO'
import { getSystemStatus } from '../../profiles/validator/VerifiedProfileValidator'
import { PushNotificationService } from '../../pushNotification/services/PushNotificationService'
import { GrandAccessACS } from '../../security/acs/strategies'
import { TagService } from '../../tag/service/TagService'
import { UserDAO } from '../../users/db/UserDAO'
import { UserSystemStatus } from '../../users/models/UserSystemStatus'
import { VotingRoundDAO } from '../../voting/db/VotingRoundDAO'
import { ModerationDAO } from '../db/ModerationDAO'
import { Moderation } from '../model/Moderation'
import { ModerationResolutionType } from '../model/ModerationResolutionType'
import { ModerationResolve } from '../model/ModerationResolve'
import { ModerationType } from '../model/ModerationType'
import { ModerationService } from './ModerationService'

@injectable()
export class ModerationServiceImpl implements ModerationService {
  private resolveMapping: {
    [key in ModerationType]: (
      trxProvider: TrxProvider,
      uid: string,
      resolution: ModerationResolutionType,
    ) => Promise<void>
  }
  constructor(
    @inject('ModerationDAO') private dao: ModerationDAO,
    @inject('DBConnection') private db: Knex,
    @inject('UserDAO') private userDAO: UserDAO,
    @inject('ProfileDAO') private profileDAO: ProfileDAO,
    @inject('PollDAO') private pollDAO: PollDAO,
    @inject('IndexTaskQueueService') private indexTaskQueue: IndexTaskQueueService,
    @inject('TagService') private tagService: TagService,
    @inject('PollService') private pollService: PollService,
    @inject('VotingRoundDAO') protected votingRoundDAO: VotingRoundDAO,
    @inject('FirebasePushNotificationService')
    protected firebasePushNotificationService: PushNotificationService,
  ) {
    this.resolveMapping = {
      [ModerationType.POLL]: this.updatePollResolution,
      [ModerationType.USER]: this.updateUserResolution,
      [ModerationType.COMMENT]: this.updateCommentResolution,
      [ModerationType.POLL_ANSWER]: this.updatePollAnswerResolution,
    }
  }

  private getStatusForApprovedPoll(pollData: Poll): PollStatus {
    const now = DateUtility.now()
    let status = PollStatus.PUBLISHED

    if (
      pollData.discussionStartAt &&
      now >= pollData.discussionStartAt &&
      pollData.complexWorkflow
    ) {
      status = PollStatus.DISCUSSION
    }

    if (now >= pollData.votingStartAt) {
      status = PollStatus.VOTING
    }

    if (now >= pollData.votingEndAt) {
      status = PollStatus.FINISHED
    }

    if (pollData.pollType === PollType.RATING_MONITOR) {
      status = PollStatus.DISCUSSION
    }

    return status
  }

  private updatePollResolution = async (
    trxProvider: TrxProvider,
    uid: string,
    resolution: ModerationResolutionType,
  ): Promise<void> => {
    logger.debug('moderation.service.update-poll-resolution.start')
    let pollData: Partial<Poll> = { status: PollStatus.REJECTED }

    if (resolution === ModerationResolutionType.APPROVED) {
      const poll = (await this.pollDAO.get(trxProvider, uid, new GrandAccessACS())) as Poll
      const pollStatus = this.getStatusForApprovedPoll(poll)
      pollData = { status: pollStatus, publishedAt: DateUtility.now() }
      await this.tagService.saveMultiple(trxProvider, poll.tags.toArray())

      const pollDataForElastic: Poll = { ...poll, ...pollData }
      await this.pollService.index(uid, pollDataForElastic)

      await this.votingRoundDAO.saveOrUpdateByPollStatus(trxProvider, pollDataForElastic)
    }

    await this.pollDAO.partialUpdate(trxProvider, uid, pollData, new GrandAccessACS())

    await this.indexTaskQueue.save(trxProvider, {
      referenceUID: uid,
      referenceType: ReferenceType.POLL,
      action: Action.INDEX,
    })

    logger.debug('moderation.service.update-poll-resolution.end')
  }

  private updateUserResolution = async (
    trxProvider: TrxProvider,
    uid: string,
    resolution: ModerationResolutionType,
  ): Promise<void> => {
    logger.debug('moderation.service.update-user-resolution.start')

    let systemStatus = UserSystemStatus.REJECTED
    if (resolution !== ModerationResolutionType.REJECTED) {
      const profile = await this.profileDAO.getProfileByUID(trxProvider, uid)
      systemStatus = getSystemStatus(profile)
    }

    await this.userDAO.partialUpdate(trxProvider, uid, { systemStatus }, new GrandAccessACS())
  }

  private updateCommentResolution = async (): Promise<void> => {
    logger.debug('moderation.service.update-comment-resolution.start')
    throw new ServerError('Not implement')
    logger.debug('moderation.service.update-comment-resolution.end')
  }

  private updatePollAnswerResolution = async (
    trxProvider: TrxProvider,
    uid: string,
    resolution: ModerationResolutionType,
  ): Promise<void> => {
    logger.debug('moderation.service.update-poll-answer-resolution.start')
    if (resolution !== ModerationResolutionType.APPROVED) {
      await this.pollDAO.updateSingleAnswer(trxProvider, { uid, status: PollAnswerStatus.REJECTED })
    } else {
      const answer = await this.pollDAO.getSinglePollAnswer(trxProvider, uid)

      const poll = (await this.pollDAO.get(
        trxProvider,
        answer?.pollUID as string,
        new GrandAccessACS(),
      )) as Poll

      await this.pollDAO.updateSingleAnswer(trxProvider, {
        uid,
        status: PollAnswerStatus.PUBLISHED,
        index: poll.answersCount,
      })
      await this.pollDAO.partialUpdate(
        trxProvider,
        poll.uid as string,
        {
          answersCount: (poll.answersCount as number) + 1,
        },
        new GrandAccessACS(),
      )

      await this.indexTaskQueue.save(trxProvider, {
        referenceUID: answer?.pollUID as string,
        referenceType: ReferenceType.POLL,
        action: Action.INDEX,
      })
    }
    logger.debug('moderation.service.update-poll-answer-resolution.end')
  }

  public async resolveOrReject(moderation: ModerationResolve): Promise<void> {
    logger.debug('moderation.service.resolve-or-reject.start')
    let moderationCase: Moderation | undefined
    let pollDataForNotification: Poll | undefined

    await TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.resolveOrReject(trxProvider, moderation)

      if (moderation.uid) {
        moderationCase = await this.dao.get(trxProvider, moderation.uid)
        if (moderationCase) {
          await this.resolveMapping[moderationCase.type](
            trxProvider,
            moderationCase.reference,
            moderationCase.resolution,
          )

          // FIXME Rewrite/remove this after implementation of new notification module
          if (moderationCase.type === ModerationType.POLL) {
            pollDataForNotification = (await this.pollDAO.get(
              trxProvider,
              moderationCase.reference,
              new GrandAccessACS(),
            )) as Poll
          }
        }
      }
      logger.debug('moderation.service.resolve-or-reject.done')
    })

    // FIXME Rewrite/remove this after implementation of new notification module
    // NOTE The need for this block is that it was decided to pull out the sending of push notifications outside the transaction
    if (moderationCase?.type === ModerationType.POLL) {
      if (moderationCase.resolution === ModerationResolutionType.APPROVED) {
        if (
          pollDataForNotification?.status !== PollStatus.PUBLISHED &&
          pollDataForNotification?.status !== PollStatus.FINISHED
        ) {
          await this.firebasePushNotificationService.sendNotificationAboutNewPoll([
            pollDataForNotification?.uid as string,
          ])
        }
      }

      await this.firebasePushNotificationService.sendNotificationChangePollStatus([
        pollDataForNotification?.uid as string,
      ])
    }
  }

  public async save(type: ModerationType, reference: string, summary: string): Promise<void> {
    logger.debug('moderation.service.create.start')

    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.save(trxProvider, type, reference, summary)
      logger.debug('moderation.service.create.done')
    })
  }

  public async get(uid: string): Promise<Moderation | undefined> {
    logger.debug('moderation.service.get.start')

    return TrxUtility.transactional<Moderation | undefined>(this.db, async trxProvider => {
      const moderation = await this.dao.get(trxProvider, uid)
      logger.debug('moderation.service.get.done')
      return moderation
    })
  }

  public async list(filter: EntityFilter): Promise<PagedList<Moderation>> {
    logger.debug('moderation.service.list.start')

    return TrxUtility.transactional<PagedList<Moderation>>(this.db, async trxProvider => {
      const list = await this.dao.list(trxProvider, filter)
      logger.debug('moderation.service.list.done')
      return list
    })
  }

  public async getModerationResult(uid: string, type: ModerationType): Promise<Moderation> {
    logger.debug(`moderation.service.get-info-${type}.start`)
    return TrxUtility.transactional<Moderation>(this.db, async trxProvider => {
      const moderation = await this.dao.getModerationResult(trxProvider, uid, type)
      if (!moderation) {
        logger.debug(`moderation.service.get-moderation-result-${type}.error.not-exist`)
        throw new ServerError(
          'Moderation case cannot be found',
          404,
          NotFoundErrorCodes.ENTITY_NOT_FOUND_ERROR,
          `get-info-of-${type}`,
        )
      }
      logger.debug(`moderation.service.get-info-${type}.done`)
      return moderation
    })
  }
}
