import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { IndexTaskQueueDAOImpl } from '../../../../src/iviche/indexTaskQueue/db/IndexTaskQueueDAOImpl'
import { IndexTaskQueueServiceImpl } from '../../../../src/iviche/indexTaskQueue/service/IndexTaskQueueServiceImpl'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { ModerationResolutionType } from '../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolve } from '../../../../src/iviche/moderation/model/ModerationResolve'
import { ModerationService } from '../../../../src/iviche/moderation/service/ModerationService'
import { ModerationServiceImpl } from '../../../../src/iviche/moderation/service/ModerationServiceImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { ProfileDAOImpl } from '../../../../src/iviche/profiles/db/ProfileDAOImpl'
import { PushNotificationService } from '../../../../src/iviche/pushNotification/services/PushNotificationService'
import { TagDAOImpl } from '../../../../src/iviche/tag/db/TagDAOImpl'
import { TagServiceImpl } from '../../../../src/iviche/tag/service/TagServiceImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDAOImpl } from '../../../../src/iviche/users/db/UserDAOImpl'
import { VotingRoundDAOImpl } from '../../../../src/iviche/voting/db/VotingRoundDAOImpl'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const PollServiceMock: jest.Mock<PollServiceImpl> = jest.fn().mockImplementation(() => {
  return {
    index: jest.fn(),
  }
})

const MockTelegramBotService: jest.Mock<TelegramBotServiceImpl> = jest
  .fn()
  .mockImplementation(() => {
    return {
      notifyModerators: jest.fn(),
    }
  })

const FirebasePushNotificationServiceMock: jest.Mock<PushNotificationService> = jest
  .fn()
  .mockImplementation(() => {
    return {
      sendNotificationChangePollStatus: jest.fn(),
      sendNotificationAboutNewPoll: jest.fn(),
    }
  })

const knexTracker = new KnexTestTracker()
const moderationService: ModerationService = new ModerationServiceImpl(
  new ModerationDAOImpl(new PollDAOImpl(), MockTelegramBotService()),
  knexTracker.getTestConnection(),
  new UserDAOImpl(),
  new ProfileDAOImpl(),
  new PollDAOImpl(),
  new IndexTaskQueueServiceImpl(new IndexTaskQueueDAOImpl()),
  new TagServiceImpl(new TagDAOImpl(), knexTracker.getTestConnection()),
  PollServiceMock(),
  new VotingRoundDAOImpl(),
  FirebasePushNotificationServiceMock(),
)

describe('Moderation cases service test', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('Update. FAIL: 404', async () => {
    // GIVEN moderation to run update
    const updateModerationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      concern: 'updated',
      resolution: ModerationResolutionType.APPROVED,
      lockingCounter: 1,
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      oneLine`
        update
            "moderation_case"
        set
            "resolution" = $1,
            "concern" = $2,
            "resolvedAt" = $3
        where
            "uid" = $4 and
            "lockingCounter" = $5 and
            "resolution" = $6`,
      0,
      false,
    )

    try {
      // WHEN moderation is updated
      await moderationService.resolveOrReject(updateModerationCase)
    } catch (e) {
      // THEN don't got error
      expect(e.httpCode).toBe(404)
      expect(e.message).toBe('Not found [moderation] entity for resolve-or-reject')
      expect(e.code).toBe(404002)
      expect(e.source).toBe('moderation')
    }
  })

  test('Update. FAIL:400', async () => {
    // GIVEN moderation to run update
    const updateModerationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      concern: 'updated',
      resolution: ModerationResolutionType.APPROVED,
      lockingCounter: 1,
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      oneLine`update "moderation_case" set "resolution" = $1, "concern" = $2, "resolvedAt" = $3
      where
      "uid" = $4 and
      "lockingCounter" = $5 and
      "resolution" = $6`,
      2,
      false,
    )

    try {
      // WHEN moderation is updated
      await moderationService.resolveOrReject(updateModerationCase)
    } catch (e) {
      // THEN don't got error
      expect(e.httpCode).toBe(400)
      expect(e.message).toBe('resolve-or-reject for entity [moderation] failed')
      expect(e.code).toBe(404004)
      expect(e.source).toBe('moderation')
    }
  })

  test('List. FAIL: count select error', async () => {
    // GIVEN expected load query method
    knexTracker.mockSQL('select count("uid") from "moderation_case" limit $1', undefined, false)

    try {
      // WHEN list of cases is loaded
      await moderationService.list({ limit: 2, offset: 2 })
    } catch (e) {
      // THEN got Application Error
      expect(e.message).toBe('Count query returned undefined. This should never really happen.')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
