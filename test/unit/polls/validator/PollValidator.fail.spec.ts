import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { container } from 'tsyringe'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../src/iviche/common/Theme'
import { CompetencyTagServiceImpl } from '../../../../src/iviche/competencyTag/service/CompetencyTagServiceImpl'
import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswer } from '../../../../src/iviche/polls/models/PollAnswer'
import { PollForm } from '../../../../src/iviche/polls/models/PollForm'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollValidator } from '../../../../src/iviche/polls/validators/PollValidator'

container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

const validator = new PollValidator()

const answersArray: Array<PollAnswer> = [
  {
    uid: 'bla',
    title: 'test1',
    basic: false,
    createdAt: new Date('02.02.2020'),
    pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
    authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
    index: 0,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test2',
    basic: false,
    createdAt: new Date('02.02.2020'),
    pollUID: '00000000-aaaa-bbbb-cccc-000000000001',
    authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
    index: 1,
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const correctAnswersArray: Array<any> = [
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test1',
    basic: true,
    index: 0,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test2',
    basic: true,
    index: 1,
  },
]

describe('Fail tests of Poll validator. Common', () => {
  test('complexWorkflow true, error: discussionStartAt is required', () => {
    // GIVEN incorrect poll data with empty discussionStartAt
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: undefined,
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"discussionStartAt" is required',
      source: 'discussionStartAt',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow true, error: votingStartAt is required', () => {
    // GIVEN incorrect poll data with empty votingStartAt
    const incorrectPoll = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-12-11T14:50:53.180+02:00',
      votingEndAt: '2100-12-11T14:50:53.180+02:00',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
    } as PollForm

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingStartAt" is required',
      source: 'votingStartAt',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow true, error: votingEndAt is required', () => {
    // GIVEN incorrect poll data with empty votingEndAt
    const incorrectPoll = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-12-11T14:50:53.180+02:00',
      votingStartAt: '2100-12-12T14:50:53.180+02:00',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
    } as PollForm

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingEndAt" is required',
      source: 'votingEndAt',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow false, error: discussionStartAt is not allowed', () => {
    // GIVEN incorrect poll data with discussionStartAt when complexWorkflow is false
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: false,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-12-11T14:50:53.180+02:00',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingEndAt: '2100-12-18T00:00:00.000Z',
      votingStartAt: '2100-12-18T00:00:00.000Z',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"discussionStartAt" is not allowed',
      source: 'discussionStartAt',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow true, error: votingEndAt less than votingStartAt', () => {
    // GIVEN incorrect poll data with wrong votingEndAt when complexWorkflow is true
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-12-15T00:00:00.000Z',
      votingEndAt: '2100-12-17T00:00:00.000Z',
      votingStartAt: '2100-12-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingEndAt" must be greater than "ref:votingStartAt"',
      source: 'votingEndAt',
      code: ValidationErrorCodes.FIELD_DATA_MAX_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow true, error: votingEndAt equal votingStartAt', () => {
    // GIVEN incorrect poll data with equal votingEndAt and votingStartAt when complexWorkflow is true
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-10T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"votingEndAt" must be greater than "ref:votingStartAt"',
      source: 'votingEndAt',
      code: ValidationErrorCodes.FIELD_DATA_MAX_VALIDATION_ERROR,
    })
  })

  test('complexWorkflow true, error: discussionStartAt earlier then current daytime', () => {
    // GIVEN incorrect poll data with discussionStartAt earlier then current daytime when complexWorkflow is true
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      complexWorkflow: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2001-12-11T14:50:53.180+02:00',
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)
    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition.source).toBe('discussionStartAt')
    expect(result.errorDefinition.code).toBe(ValidationErrorCodes.FIELD_DATA_MIN_VALIDATION_ERROR)
    expect(result.errorDefinition.message).toMatch(
      '"discussionStartAt" must be larger than or equal to',
    )
  })

  test('theme value is not one of theme Enum', () => {
    // GIVEN incorrect poll data with theme that do not exist in the application
    const incorrectPoll: PollForm = {
      draft: false,
      theme: 'NOT OTHER',
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // FIXME: use theme enum
    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: oneLine`"theme" must be one of [ELECTION, RIGHT, BUSINESS, TECHNOLOGIES,
        DOMESTIC_POLICY, REGIONAL_POLICY, FOREIGN_POLICY, LEGISLATION, PARLIAMENTARY_ACTIVITY, CABINET_OF_MINISTERS_ACTIVITY,
        PRESIDENT_ACTIVITY, ECONOMICS, FISCAL_POLICY, LAW_ENFORCEMENT, SOCIAL_SECURITY, PENSION_SYSTEM, COMMUNITY_SYSTEM, TARIFFS,
        EDUCATION, HEALTH_CARE, CULTURE, AGRICULTURE, ENVIRONMENT_PROTECTION, JOURNALISM, MILITARY, SPORT, SCIENCE, OTHER]`,
      source: 'theme',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('taSocialStatuses value is not one of SocialStatus Enum', () => {
    // GIVEN taSocialStatuses poll data with status that do not exist in the application
    const incorrectPoll: {} = {
      draft: false,
      theme: 'OTHER',
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      taSocialStatuses: ['TEST', 'TEST2'],
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
    }

    const poll = incorrectPoll as PollForm

    // WHEN data will be validated
    const result = validator.validate(poll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: oneLine`"taSocialStatuses[0]" must be one of [CLERK, WORKER, MANAGER, UNEMPLOYED, SELFEMPLOYED,
       STUDENT, RETIREE, UNKNOWN]`,
      source: 'taSocialStatuses.0',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('draft === false. When draft is false than body is required', async () => {
    // GIVEN correct poll data
    const correctPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      complexWorkflow: true,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      anonymous: true,
      title: 'Test title in basic poll valid',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: correctAnswersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      draft: false,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(correctPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"body" is required',
      source: 'body',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('pollAnswer, error: wrong answer uid', () => {
    // GIVEN incorrect poll data with empty discussionStartAt
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"answers[0].uid" must be a valid GUID',
      source: 'answers.0.uid',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('pollAnswer, error: wrong answer index', () => {
    // GIVEN incorrect poll data with empty discussionStartAt
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      answers: [
        {
          uid: '00000000-aaaa-bbbb-cccc-000000000001',
          title: 'test1',
          basic: true,
          index: 0,
        },
        {
          uid: '00000000-aaaa-bbbb-cccc-000000000001',
          title: 'test2',
          basic: true,
          index: 3,
        },
      ],
      image: '00000000-aaaa-bbbb-cccc-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)
    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      code: 400004,
      message: 'Answers index not match the pattern ',
      source: 'poll.answers.index',
    })
  })

  test('pollAnswer, error: unavailable character in tags', () => {
    // GIVEN incorrect poll data -> unavailable character in tags
    const pollForm: PollForm = {
      theme: 'OTHER',
      draft: false,
      complexWorkflow: false,
      anonymous: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      tags: ['#Non cor.rect'],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(pollForm)
    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      code: 400000,
      message: `"tags[0]" with value "#Non cor.rect" fails to match the required pattern: /^[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+(\\s[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+)*$/`,
      source: 'tags.0',
    })
  })

  test('pollAnswer, error: Non existing competencyTag', () => {
    // GIVEN incorrect poll data -> Non existing competencyTag
    const pollForm: PollForm = {
      theme: 'OTHER',
      draft: false,
      complexWorkflow: false,
      anonymous: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      tags: ['tag'],
      competencyTags: ['non_existing_tag'],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(pollForm)
    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      code: 400000,
      message: '"competencyTags[0]" does not match any of the allowed types',
      source: 'competencyTags.0',
    })
  })

  test('pollAnswer. NOT DRAFT, error: answer required', () => {
    // GIVEN incorrect poll data with empty answer
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      title: 'Test',
      body: 'Test body in basic poll valid, text text text text text',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"answers" is required',
      source: 'answers',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('pollAnswer. NOT DRAFT, error: body required', () => {
    // GIVEN incorrect poll data with empty body
    const incorrectPoll: PollForm = {
      theme: Theme.AGRICULTURE,
      draft: false,
      title: 'Test',
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: correctAnswersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      votingStartAt: '2100-08-10T00:26:53.180+02:00',
      votingEndAt: '2100-08-11T00:26:53.180+02:00',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"body" is required',
      source: 'body',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })
})
