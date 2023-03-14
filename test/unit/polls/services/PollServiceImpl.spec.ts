import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../src/iviche/common/Theme'
import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { Elastic } from '../../../../src/iviche/elastic/Elastic'
import { ModerationDAO } from '../../../../src/iviche/moderation/db/ModerationDAO'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { PollDAOImpl } from '../../../../src/iviche/polls/db/PollDAOImpl'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { Poll } from '../../../../src/iviche/polls/models/Poll'
import { PollAnswerStatus } from '../../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollService } from '../../../../src/iviche/polls/services/PollService'
import { PollServiceImpl } from '../../../../src/iviche/polls/services/PollServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { PollUpdateACS } from '../../../../src/iviche/security/acs/strategies/PollUpdateACS'
import { usersList } from '../../../database/seeds/01_InitialData'
import { administratorData } from '../../../i9n/common/TestUtilities'
import { KnexTestTracker } from '../../common/KnexTestTracker'
import { pollDTOList } from './PollServiceHelper'

const knexTracker = new KnexTestTracker()

const moderationDAOMock: jest.Mock<ModerationDAO> = jest.fn().mockImplementation(() => {
  return {
    create: jest.fn(),
  }
})

const ElasticMock: jest.Mock<Elastic> = jest.fn().mockImplementation(() => {
  return {
    index: jest.fn(),
  }
})

const pollService: PollService = new PollServiceImpl(
  new PollDAOImpl(),
  knexTracker.getTestConnection(),
  new ElasticMock(),
  new moderationDAOMock(),
  new PersonDAOImpl(),
)

describe('Polls service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('create poll', async () => {
    // GIVEN poll data to be saved
    const pollData: Poll = {
      complexWorkflow: false,
      theme: Theme.OTHER,
      status: PollStatus.DRAFT,
      anonymous: true,
      publishedAt: DateUtility.now(),
      votingStartAt: DateUtility.now(),
      votingEndAt: DateUtility.now(),
      tags: List([]),
      competencyTags: List([]),
      taAgeGroups: List([]),
      taSocialStatuses: List([]),
      taGenders: List([]),
      title: 'Test title of poll #55 (created poll)',
      body: 'Test perfect body of poll #55 (created poll)',
      authorUID: usersList[2].uid as string,
      answersCount: 1,
      votesCount: 0,
      commentsCount: 0,
      taAddressRegion: Region.IVANO_FRANKIVSK_REGION,
      answers: List([
        {
          title: 'test1',
          basic: false,
          createdAt: new Date('02.02.2020'),
          index: 0,
          pollUID: '',
          authorUID: '',
          status: PollAnswerStatus.MODERATION,
        },
      ]),
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }
    // AND expected save query method
    knexTracker.mockSQL(
      [
        oneLine`insert into "poll"
          ("anonymous", "answersCount", "authorUID",
          "body", "competencyTags", "complexWorkflow",
          "createdAt", "discussionStartAt", "image", "pollType", "status",
          "taAddressDistrict", "taAddressRegion", "taAddressTown",
          "taAgeGroups", "taGenders", "taSocialStatuses",
          "tags", "theme", "title", "uid",
          "votingEndAt", "votingStartAt")
        values
          ($1, $2, $3, $4, $5, $6, $7, DEFAULT, $8, $9, $10, DEFAULT, $11, DEFAULT, $12, $13, $14, $15, $16, $17, $18, $19, $20)`,
        oneLine`insert into "poll_answer" ("authorUID", "basic", "createdAt", "index", "pollUID", "status", "title", "uid")
        values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      ],
      [1, 1],
    )
    // WHEN poll is saved
    const uid = await pollService.savePoll(pollData, true, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('update poll', async () => {
    // GIVEN poll to run update
    const pollDataForUpdate: Poll = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000005',
      complexWorkflow: false,
      theme: Theme.OTHER,
      status: PollStatus.COMPLETED,
      anonymous: true,
      discussionStartAt: DateUtility.fromISO('2100-08-05T00:00:00.000Z'),
      votingStartAt: DateUtility.fromISO('2100-08-10T00:00:00.000Z'),
      votingEndAt: DateUtility.fromISO('2100-08-18T00:00:00.000Z'),
      tags: List([]),
      competencyTags: List([]),
      taAgeGroups: List([AgeGroup.TWENTY]),
      taSocialStatuses: List([SocialStatus.CLERK]),
      taAddressRegion: Region.DNIPROPETROVSK_REGION,
      taGenders: List([Gender.MALE]),
      title: 'Test title of poll #5 (created poll)',
      body: 'Test perfect body of poll #5 (created poll)',
      authorUID: usersList[2].uid as string,
      answersCount: 1,
      votesCount: 0,
      commentsCount: 0,
      answers: List([
        {
          title: 'test1',
          pollUID: '',
          authorUID: '',
          basic: true,
          index: 0,
          status: PollAnswerStatus.PUBLISHED,
        },
        {
          title: 'test2',
          pollUID: '',
          authorUID: '',
          basic: true,
          index: 1,
          status: PollAnswerStatus.PUBLISHED,
        },
      ]),
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }
    // AND expected poll data
    const respPollDTO = [
      { ...pollDTOList[0], status: 'DRAFT' },
      { ...pollDTOList[1], status: 'DRAFT' },
    ]
    // AND expected update query
    knexTracker.mockSQL(
      [
        oneLine`select
          "poll"."uid" as "uid",
          "poll"."theme" as "theme",
          "poll"."complexWorkflow" as "complexWorkflow",
          "poll"."anonymous" as "anonymous",
          "poll"."status" as "status",
          "poll"."title" as "title", "poll"."body" as "body",
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
        where
          "poll"."uid" = $1
          and ("poll"."authorUID" = $2 and "poll"."status" in ($3, $4))`,
        oneLine`update "poll"
          set "theme" = $1, "complexWorkflow" = $2, "anonymous" = $3, "status" = $4,
            "title" = $5, "body" = $6, "discussionStartAt" = $7,
            "votingStartAt" = $8, "votingEndAt" = $9, "tags" = $10,
            "competencyTags" = $11, "taAgeGroups" = $12, "taGenders" = $13,
            "taSocialStatuses" = $14, "taAddressRegion" = $15, "answersCount" = $16,
            "votesCount" = $17, "pollType" = $18, "image" = $19
          where "uid" = $20
            and ("poll"."authorUID" = $21 and "poll"."status" in ($22, $23))`,
        'delete from "poll_answer" where "pollUID" = $1',
        oneLine`insert into "poll_answer" ("authorUID", "basic", "createdAt", "index", "pollUID", "status", "title", "uid")
        values ($1, $2, $3, $4, $5, $6, $7, $8),
          ($9, $10, $11, $12, $13, $14, $15, $16)`,
      ],
      [respPollDTO, 1, 0, 2],
    )

    // WHEN poll is saved

    await pollService.savePoll(pollDataForUpdate, true, new PollUpdateACS(administratorData.uid))
    // THEN dont go error
  })

  test('delete poll', async () => {
    // GIVEN poll uid to be deleted
    const pollUid = '00000000-aaaa-aaaa-aaaa-000000000005'
    // AND expected delete query
    knexTracker.mockSQL(
      ['delete from "poll_answer" where "pollUID" = $1', 'delete from "poll" where "uid" = $1'],
      [1, 1],
    )
    // WHEN poll is deleted
    await pollService.delete(pollUid, new GrandAccessACS())

    // THEN no errors occur
  })

  test('load active polls by statuses', async () => {
    // GIVEN expected polls list to be loaded
    const expected = [{ uid: '00000000-aaaa-aaaa-aaaa-000000000001' }]
    // AND expected load queries
    knexTracker.mockSQL(['select "uid" from "poll" where "status" in ($1, $2, $3)'], [expected])

    // WHEN polls list is loaded
    const loadedList = await pollService.getPollByStatuses([
      PollStatus.DISCUSSION,
      PollStatus.VOTING,
      PollStatus.PUBLISHED,
    ])
    // THEN loadedList must be equal to the expected one
    expect(loadedList).toEqual(expected)
  })

  test('getUniqAuthorUIDs (private function)', async () => {
    // GIVEN poll answers with different authors
    const poll = {
      authorUID: usersList[2].uid as string,
      answers: List([
        {
          title: 'test1',
          pollUID: '00000000-aaaa-aaaa-aaaa-000000000005',
          authorUID: usersList[2].uid,
          basic: true,
          index: 0,
          status: PollAnswerStatus.PUBLISHED,
        },
        {
          title: 'test2',
          pollUID: '00000000-aaaa-aaaa-aaaa-000000000005',
          authorUID: usersList[2].uid,
          basic: true,
          index: 1,
          status: PollAnswerStatus.PUBLISHED,
        },
        {
          title: 'test3',
          pollUID: '00000000-aaaa-aaaa-aaaa-000000000005',
          authorUID: usersList[5].uid,
          basic: true,
          index: 2,
          status: PollAnswerStatus.PUBLISHED,
        },
        {
          title: 'test4',
          pollUID: '00000000-aaaa-aaaa-aaaa-000000000005',
          authorUID: usersList[5].uid,
          basic: true,
          index: 3,
          status: PollAnswerStatus.PUBLISHED,
        },
      ]),
    } as Poll

    // WHEN getting uniq answers author uids not including poll author uid
    const result = PollServiceImpl.prototype['getUniqAnswerAuthorUIDs'](poll)

    // THEN got array of uniq answer author uids without poll author uid
    expect(Array.isArray(result)).toBeTruthy()
    expect(result.length).toBe(1)
    expect(result[0]).not.toBe(poll.authorUID)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
