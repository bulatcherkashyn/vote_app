import 'reflect-metadata'

import { container } from 'tsyringe'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { CompetencyTagService } from '../../../../src/iviche/competencyTag/service/CompetencyTagService'
import { CompetencyTagServiceImpl } from '../../../../src/iviche/competencyTag/service/CompetencyTagServiceImpl'
import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswerStatus } from '../../../../src/iviche/polls/models/PollAnswerStatus'
import { PollForm } from '../../../../src/iviche/polls/models/PollForm'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollValidator } from '../../../../src/iviche/polls/validators/PollValidator'
import { createRandomString } from '../../common/TestUtilities'

container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

const validator = new PollValidator()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const answersArray: Array<any> = [
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test1',
    basic: true,
    index: 0,
    status: PollAnswerStatus.PUBLISHED,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    title: 'test2',
    basic: true,
    index: 1,
    status: PollAnswerStatus.PUBLISHED,
  },
]

const competencyTagService = container.resolve<CompetencyTagService>('CompetencyTagService')
const flatCompetencyTagList = competencyTagService.getFlattenCompetencyTagsList()

describe('Fail tests of Poll validator. Length Exceeds', () => {
  test('title too long', () => {
    // GIVEN incorrect poll data with too long title
    const incorrectPoll: PollForm = {
      theme: 'OTHER',
      complexWorkflow: false,
      anonymous: true,
      draft: true,
      title: createRandomString(256),
      body: 'Test body in basic poll valid, text text text text text',
      tags: ['Some tags'],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"title" length must be less than or equal to 255 characters long',
      source: 'title',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('body too long', () => {
    // GIVEN incorrect poll data with too long body
    const incorrectPoll: PollForm = {
      title: 'test',
      body: createRandomString(20002),
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      draft: true,
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      theme: 'OTHER',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"body" length must be less than or equal to 20000 characters long',
      source: 'body',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('tags too long', () => {
    // GIVEN incorrect poll data with too long tags
    const incorrectPoll: PollForm = {
      title: 'test',
      body: 'test',
      tags: [createRandomString(51)],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      draft: true,
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      theme: 'OTHER',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"tags[0]" length must be less than or equal to 50 characters long',
      source: 'tags.0',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('competencyTags too long', () => {
    const incorrectAmountOfCompetencyTags = flatCompetencyTagList.slice(0, 11)
    // GIVEN incorrect poll data with too long array of competencyTags
    const incorrectPoll: PollForm = {
      title: 'test',
      body: 'test',
      competencyTags: incorrectAmountOfCompetencyTags,
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      draft: true,
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      theme: 'OTHER',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message: '"competencyTags" must contain less than or equal to 10 items',
      source: 'competencyTags',
      code: ValidationErrorCodes.UNKNOWN_VALIDATION_ERROR,
    })
  })

  test('taAddressRegion too long', () => {
    // GIVEN incorrect poll data with too long taAddressRegion
    const incorrectPoll: PollForm = {
      title: 'test',
      body: 'test',
      taAddressRegion: createRandomString(65) as Region,
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      draft: true,
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      theme: 'OTHER',
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN data will be validated
    const result = validator.validate(incorrectPoll)

    // THEN errorMessage in result object must contain error message indicating an error property
    expect(result.errorDefinition).toStrictEqual({
      message:
        '"taAddressRegion" must be one of [CHERKASY_REGION, CHERNIHIV_REGION, CHERNIVTSI_REGION, DNIPROPETROVSK_REGION, DONETSK_REGION, IVANO_FRANKIVSK_REGION, KHARKIV_REGION, KHERSON_REGION, KHMELNYTSKYI_REGION, KYIV_REGION, KIROVOHRAD_REGION, LUHANSK_REGION, LVIV_REGION, MYKOLAIV_REGION, ODESSA_REGION, POLTAVA_REGION, RIVNE_REGION, SUMY_REGION, TERNOPIL_REGION, VINNYTSIA_REGION, VOLYN_REGION, ZAKARPATTIA_REGION, ZAPORIZHZHIA_REGION, ZHYTOMYR_REGION, KRYM_REGION, KYIV_CITY_REGION, COUNTRY_WIDE]',
      source: 'taAddressRegion',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })
})
