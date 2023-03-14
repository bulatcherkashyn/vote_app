import 'reflect-metadata'

import { container } from 'tsyringe'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../src/iviche/common/Theme'
import { CompetencyTagServiceImpl } from '../../../../src/iviche/competencyTag/service/CompetencyTagServiceImpl'
import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../../src/iviche/polls/models/PollAnswerStatus'
import { PollForm } from '../../../../src/iviche/polls/models/PollForm'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollValidator } from '../../../../src/iviche/polls/validators/PollValidator'

container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

const validator = new PollValidator()

// NOTE: c.f. - correct format, inc.f. - incorrect format
const answersArray: Array<PollAnswer> = [
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test1',
    basic: false,
    createdAt: new Date('02.02.2020'),
    pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
    authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
    status: PollAnswerStatus.MODERATION,
    index: 0,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test2',
    basic: false,
    createdAt: new Date('02.02.2020'),
    pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
    authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
    status: PollAnswerStatus.MODERATION,
    index: 1,
  },
]

describe('Fail tests of Poll validator. Date', () => {
  test('complexWorkflow true, discussionStartAt inc.f., votingStartAt c.f., votingEndAt c.f.', () => {
    // GIVEN incorrect poll data with incorrect discussionStartAt date format
    const incorrectPoll: PollForm = {
      draft: false,
      theme: Theme.OTHER,
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-12-11T14:50:5.180+02:00',
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"discussionStartAt" must be in ISO 8601 date format',
      source: 'discussionStartAt',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('complexWorkflow true, discussionStartAt c.f., votingStartAt inc.f., votingEndAt c.f.', () => {
    // GIVEN incorrect poll data with incorrect votingStartAt date format
    const incorrectPoll: PollForm = {
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-07-11T14:50:53.180+02:00',
      votingStartAt: '2100-08-10T00:26:53.180+02:',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      draft: false,
      theme: Theme.OTHER,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingStartAt" must be in ISO 8601 date format',
      source: 'votingStartAt',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('complexWorkflow true, discussionStartAt c.f., votingStartAt c.f., votingEndAt inc.f.', () => {
    // GIVEN incorrect poll data with incorrect votingEndAt date format
    const incorrectPoll: PollForm = {
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-07-11T14:50:53.180+02:00',
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-10T00:26:53.180+02:',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      draft: false,
      theme: Theme.OTHER,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingEndAt" must be in ISO 8601 date format',
      source: 'votingEndAt',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })
})
