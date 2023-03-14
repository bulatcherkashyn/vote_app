import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { UserRole } from '../../../../src/iviche/common/UserRole'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { IndexTaskQueueDAOImpl } from '../../../../src/iviche/indexTaskQueue/db/IndexTaskQueueDAOImpl'
import { IndexTaskQueueServiceImpl } from '../../../../src/iviche/indexTaskQueue/service/IndexTaskQueueServiceImpl'
import { ModerationDAOImpl } from '../../../../src/iviche/moderation/db/ModerationDAOImpl'
import { ModerationResolutionType } from '../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolve } from '../../../../src/iviche/moderation/model/ModerationResolve'
import { ModerationType } from '../../../../src/iviche/moderation/model/ModerationType'
import { ModerationService } from '../../../../src/iviche/moderation/service/ModerationService'
import { ModerationServiceImpl } from '../../../../src/iviche/moderation/service/ModerationServiceImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { ProfileDAOImpl } from '../../../../src/iviche/profiles/db/ProfileDAOImpl'
import { PushNotificationService } from '../../../../src/iviche/pushNotification/services/PushNotificationService'
import { TagDAOImpl } from '../../../../src/iviche/tag/db/TagDAOImpl'
import { TagServiceImpl } from '../../../../src/iviche/tag/service/TagServiceImpl'
import { TelegramBotServiceImpl } from '../../../../src/iviche/telegram-bot/TelegramBotServiceImpl'
import { UserDAOImpl } from '../../../../src/iviche/users/db/UserDAOImpl'
import { VotingRoundDAOImpl } from '../../../../src/iviche/voting/db/VotingRoundDAOImpl'
import { personsList } from '../../../database/seeds/01_InitialData'
import { moderatorData } from '../../../i9n/common/TestUtilities'
import { pollsList } from '../../../i9n/routes/controllers/polls/PollControllerHelper'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { pollArray, pollDTOList } from '../../polls/services/PollServiceHelper'

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

  test('get. Successful.', async () => {
    // GIVEN moderation to run create

    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      type: ModerationType.POLL,
      summary: personsList[2].firstName + ' ' + personsList[2].lastName,
      moderatorUID: moderatorData.uid,
      reference: pollsList[0].uid as string,
      resolution: ModerationResolutionType.PENDING,
      concern: 'test',
    }

    //  AND expected create query method
    knexTracker.mockSQL(
      [
        oneLine`select * from "moderation_case" where "uid" = $1 limit $2`,
        oneLine`select
          "poll"."uid" as "uid",
          "poll"."theme" as "theme",
          "poll"."complexWorkflow" as "complexWorkflow",
          "poll"."anonymous" as "anonymous",
          "poll"."status" as "status",
          "poll"."title" as "title",
          "poll"."body" as "body",
          "poll"."createdAt" as "createdAt",
          "poll"."publishedAt" as "publishedAt",
          "poll"."discussionStartAt" as "discussionStartAt",
          "poll"."votingStartAt" as "votingStartAt",
          "poll"."votingEndAt" as "votingEndAt",
          "poll"."tags" as "tags",
          "poll"."competencyTags" as "competencyTags",
          "poll"."taAddressRegion" as "taAddressRegion",
          "poll"."taAddressDistrict" as "taAddressDistrict",
          "poll"."taAddressTown" as "taAddressTown",
          "poll"."taSocialStatuses" as "taSocialStatuses",
          "poll"."taAgeGroups" as "taAgeGroups",
          "poll"."taGenders" as "taGenders",
          "poll"."authorUID" as "authorUID",
          "poll"."answersCount" as "answersCount",
          "poll"."votesCount" as "votesCount",
          "poll"."commentsCount" as "commentsCount",
          "poll"."isHidden" as "isHidden",
          "poll"."pollType" as "pollType",
          "poll"."image" as "image",
          "poll_answer"."uid" as "answerUid",
          "poll_answer"."basic" as "answerBasic",
          "poll_answer"."status" as "answerStatus",
          "poll_answer"."index" as "answerIndex",
          "poll_answer"."title" as "answerTitle",
          "poll_answer"."createdAt" as "answerCreatedAt",
          "poll_answer"."authorUID" as "answerAuthorUID",
          "authorPerson"."isLegalPerson" as "authorIsLegalPerson",
          "authorPerson"."firstName" as "authorFirstName",
          "authorPerson"."lastName" as "authorLastName",
          "authorPerson"."shortName" as "authorShortName",
          "authorPerson"."avatar" as "authorAvatar",
          "authorPerson"."email" as "authorEmail"
        from "poll"
          left join "poll_answer" on "poll"."uid" = "poll_answer"."pollUID"
          inner join "users" as "authorUser" on "poll"."authorUID" = "authorUser"."uid"
          inner join "person" as "authorPerson" on "authorUser"."personUID" = "authorPerson"."uid"
        where "poll"."uid" = $1`,
      ],
      [moderationCase, [pollDTOList[0], pollDTOList[1]]],
    )

    // WHEN get case
    const result = await moderationService.get(moderationCase.uid)
    // THEN got object
    expect(result).toStrictEqual({
      referencedObject: pollArray[0],
      authorData: undefined,
      ...moderationCase,
    })
  })

  test('Update. Successful.', async () => {
    // GIVEN moderation to run update
    const updateModerationCase: ModerationResolve = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000001',
      concern: 'updated',
      resolution: ModerationResolutionType.APPROVED,
      lockingCounter: 1,
    }

    const moderation = {
      uid: '00000000-aaaa-aaaa-cccc-000000000003',
      type: ModerationType.USER,
      reference: '00000000-aaaa-aaaa-bccc-000000000002',
      resolution: 'APPROVED',
      concern: 'updated',
      summary: 'user registration',
      moderatorUID: '00000000-aaaa-aaaa-aaaa-000000000004',
    }
    const referencedObject = {
      uid: '00000000-aaaa-aaaa-bbcc-000000000002',
      isLegalPerson: false,
      isPublicPerson: false,
      firstName: 'Test',
      lastName: 'Moderation2',
      email: 'testModeration2@iviche.com',
      phone: '+380440001199#1',
      birthdayAt: DateUtility.fromISO('2000-11-27T13:43:30.212Z'),
      gender: 'MALE',
      socialStatus: 'CLERK',
      addressRegion: 'KYIV_CITY',
      addressDistrict: 'some district',
      createdAt: DateUtility.fromISO('2019-11-27T13:43:30.212Z'),
    }

    const profile = {
      user: {
        uid: '00000000-aaaa-aaaa-bccc-000000000002',
        role: UserRole.PRIVATE,
        username: 'moderationTestUser2',
        password: '',
      },
      details: {
        systemStatus: 'UNCHECKED',
        emailConfirmed: true,
        phoneConfirmed: true,
        notifyEmail: false,
        notifyTelegram: false,
        notifyViber: false,
        notifySMS: false,
        notifyAboutNewPoll: false,
      },
      person: {
        isLegalPerson: false,
        isPublicPerson: false,
        firstName: 'Test',
        lastName: 'Moderation2',
        email: 'testModeration2@iviche.com',
        phone: '+380440001199#1',
        birthdayAt: DateUtility.fromISO('2000-11-26T22:00:00.000Z'),
        gender: 'MALE',
        socialStatus: 'CLERK',
        addressRegion: 'KYIV_CITY',
        addressDistrict: 'some district',
      },
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      [
        oneLine`update "moderation_case" set "resolution" = $1, "concern" = $2, "resolvedAt" = $3
        where
          "uid" = $4
          and "lockingCounter" = $5
          and "resolution" = $6`,
        oneLine`select * from "moderation_case" where "uid" = $1 limit $2`,
        oneLine`select "person".* from "person" inner join "users" on "person"."uid" = "users"."personUID" where "users"."uid" = $1 limit $2`,
        oneLine`select
          "users"."uid" as "uid",
          "users"."username" as "username",
          "users"."role" as "role",
          "users"."systemStatus" as "systemStatus",
          "person"."isLegalPerson" as "isLegalPerson",
          "person"."isPublicPerson" as "isPublicPerson",
          "person"."firstName" as "firstName",
          "person"."middleName" as "middleName",
          "person"."lastName" as "lastName",
          "person"."jobTitle" as "jobTitle",
          "person"."legalName" as "legalName",
          "person"."shortName" as "shortName",
          "person"."tagline" as "tagline",
          "person"."email" as "email",
          "person"."phone" as "phone",
          "person"."birthdayAt" as "birthdayAt",
          "person"."gender" as "gender",
          "person"."socialStatus" as "socialStatus",
          "person"."bio" as "bio",
          "person"."addressRegion" as "addressRegion",
          "person"."addressDistrict" as "addressDistrict",
          "person"."addressTown" as "addressTown",
          "person"."avatar" as "avatar",
          "user_details"."emailConfirmed" as "emailConfirmed",
          "user_details"."phoneConfirmed" as "phoneConfirmed",
          "user_details"."notifyViber" as "notifyViber",
          "user_details"."notifyTelegram" as "notifyTelegram",
          "user_details"."notifySMS" as "notifySMS",
          "user_details"."notifyEmail" as "notifyEmail",
          "user_details"."notifyAboutNewPoll" as "notifyAboutNewPoll",
          "user_details"."linkFacebook" as "linkFacebook",
          "user_details"."linkGoogle" as "linkGoogle",
          "user_details"."linkSite" as "linkSite",
          "user_details"."linkApple" as "linkApple",
          "user_details"."wpJournalistID" as "wpJournalistID",
          "user_details"."googleId" as "googleId",
          "user_details"."appleId" as "appleId",
          "user_details"."facebookId" as "facebookId",
          "user_details"."language" as "language"
        from "person"
          left join "users" on "users"."personUID" = "person"."uid"
          left join "user_details" on "user_details"."uid" = "users"."uid"
        where "users"."uid" = $1
          limit $2`,
        oneLine`update "users" set "systemStatus" = $1 where "uid" = $2`,
      ],
      [1, moderation, referencedObject, profile, 1],
    )

    // WHEN moderation is updated
    await moderationService.resolveOrReject(updateModerationCase)
    // THEN don't got error
  })

  test('List. Successful.', async () => {
    // GIVEN expected cases list to be loaded
    const expectedCasesList = {
      list: List([
        {
          uid: '00000000-0000-0000-0000-000000000001',
          type: ModerationType.USER,
          reference: '00000000-aaaa-aaaa-aaaa-000000000001',
          concern: 'just text',
          resolution: ModerationResolutionType.PENDING,
        },
        {
          uid: '00000000-0000-0000-0000-000000000002',
          type: ModerationType.USER,
          reference: '00000000-aaaa-aaaa-aaaa-000000000002',
          concern: 'just text 2',
          resolution: ModerationResolutionType.PENDING,
        },
      ]),
      metadata: { limit: 2, offset: 2, total: 4 },
    }

    // AND expected load query method
    knexTracker.mockSQL(
      [
        'select count("uid") from "moderation_case" limit $1',
        'select * from "moderation_case" limit $1 offset $2',
      ],
      [{ count: 4 }, expectedCasesList.list.toArray()],
    )

    // WHEN list of cases is loaded
    const loadedCasesList = await moderationService.list({ limit: 2, offset: 2 })

    // THEN the loaded list must be equal to the expected
    expect(loadedCasesList).toEqual(expectedCasesList)
  })

  test('get info of rejected poll. Successful.', async () => {
    // GIVEN poll uid
    const pollUID = pollsList[2].uid as string

    // AND expected moderation case
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      type: ModerationType.POLL,
      summary: personsList[2].firstName + ' ' + personsList[2].lastName,
      moderatorUID: moderatorData.uid,
      reference: pollUID,
      resolution: ModerationResolutionType.REJECTED,
      concern: 'test',
    }

    //  AND expected select query method
    knexTracker.mockSQL(
      [
        oneLine`select * from "moderation_case"
        where
          "type" = $1 and "reference" = $2
          and not "resolution" = $3
        order by "resolvedAt" desc limit $4`,
      ],
      [moderationCase],
    )

    // WHEN get moderation info of rejected poll
    const result = await moderationService.getModerationResult(pollUID, ModerationType.POLL)

    // THEN got moderation case
    expect(result).toStrictEqual({
      ...moderationCase,
      reference: pollUID,
    })
  })

  test('getStatusForApprovedPoll. PUBLISHED', async () => {
    // GEVIN required Poll fields for calculating status
    const pollData: Partial<Poll> = {
      discussionStartAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
      votingStartAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
      votingEndAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
    }

    // WHEN get status for approved poll
    const result = ModerationServiceImpl.prototype['getStatusForApprovedPoll'](pollData as Poll)

    // THEN status must be PUBLISHED
    expect(result).toBe(PollStatus.PUBLISHED)
  })

  test('getStatusForApprovedPoll. DISCUSSION', async () => {
    // GEVIN required Poll fields for calculating status
    const pollData: Partial<Poll> = {
      discussionStartAt: DateUtility.fromISO('2020-01-01T00:00:00.000Z'),
      votingStartAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
      votingEndAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
      complexWorkflow: true,
    }

    // WHEN get status for approved poll
    const result = ModerationServiceImpl.prototype['getStatusForApprovedPoll'](pollData as Poll)

    // THEN status must be DISCUSSION
    expect(result).toBe(PollStatus.DISCUSSION)
  })

  test('getStatusForApprovedPoll. VOTING', async () => {
    // GEVIN required Poll fields for calculating status
    const pollData: Partial<Poll> = {
      discussionStartAt: DateUtility.fromISO('2020-01-01T10:00:00.000Z'),
      votingStartAt: DateUtility.fromISO('2020-01-01T11:00:00.000Z'),
      votingEndAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
    }

    // WHEN get status for approved poll
    const result = ModerationServiceImpl.prototype['getStatusForApprovedPoll'](pollData as Poll)

    // THEN status must be VOTING
    expect(result).toBe(PollStatus.VOTING)
  })

  test('getStatusForApprovedPoll. FINISHED', async () => {
    // GEVIN required Poll fields for calculating status
    const pollData: Partial<Poll> = {
      discussionStartAt: DateUtility.fromISO('2020-01-01T10:00:00.000Z'),
      votingStartAt: DateUtility.fromISO('2020-01-01T11:00:00.000Z'),
      votingEndAt: DateUtility.fromISO('2020-01-02T11:00:00.000Z'),
    }

    // WHEN get status for approved poll
    const result = ModerationServiceImpl.prototype['getStatusForApprovedPoll'](pollData as Poll)

    // THEN status must be FINISHED
    expect(result).toBe(PollStatus.FINISHED)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
