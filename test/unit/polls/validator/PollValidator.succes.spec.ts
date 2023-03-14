import 'reflect-metadata'

import { container } from 'tsyringe'

import { Gender } from '../../../../src/iviche/common/Gender'
import { Region } from '../../../../src/iviche/common/Region'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../../src/iviche/common/Theme'
import { CompetencyTagService } from '../../../../src/iviche/competencyTag/service/CompetencyTagService'
import { CompetencyTagServiceImpl } from '../../../../src/iviche/competencyTag/service/CompetencyTagServiceImpl'
import { AgeGroup } from '../../../../src/iviche/polls/models/AgeGroup'
import { PollAnswerForm } from '../../../../src/iviche/polls/models/PollAnswerForm'
import { PollForm } from '../../../../src/iviche/polls/models/PollForm'
import { PollType } from '../../../../src/iviche/polls/models/PollType'
import { PollValidator } from '../../../../src/iviche/polls/validators/PollValidator'

container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

const validator = new PollValidator()

const answersArray: Array<PollAnswerForm> = [
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
const competencyTagService = container.resolve<CompetencyTagService>('CompetencyTagService')
const flatCompetencyTagList = competencyTagService.getFlattenCompetencyTagsList()

describe('Successfully tests of Poll validator', () => {
  test('ComplexWorkflow FALSE', () => {
    // GIVEN correct poll data
    const correctPoll: PollForm = {
      draft: false,
      theme: Theme.AGRICULTURE,
      votingStartAt: '2100-12-10T00:00:00.000Z',
      votingEndAt: '2100-12-18T00:00:00.000Z',
      complexWorkflow: false,
      anonymous: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      tags: ['tags anotherWord'],
      competencyTags: [flatCompetencyTagList[0], flatCompetencyTagList[1]],
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-aaaa-bbbb-cccc-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(correctPoll)
    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('ComplexWorkflow TRUE', async () => {
    // GIVEN correct poll data
    const correctPoll: PollForm = {
      draft: false,
      theme: Theme.AGRICULTURE,
      complexWorkflow: true,
      anonymous: true,
      title: 'Test title in basic poll valid',
      body: 'Test body in basic poll valid, text text text text text',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      pollType: PollType.REGULAR,
      image: '00000000-aaaa-bbbb-cccc-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(correctPoll)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('draft === true. When draft is true then body can be empty and include empty optional fields', async () => {
    // GIVEN correct poll data
    const correctPoll: PollForm = {
      theme: Theme.OTHER,
      complexWorkflow: true,
      anonymous: true,
      title: 'Test title in basic poll valid',
      discussionStartAt: '2100-08-05T00:00:00.000Z',
      votingStartAt: '2100-08-10T00:00:00.000Z',
      votingEndAt: '2100-08-18T00:00:00.000Z',
      taSocialStatuses: [SocialStatus.CLERK, SocialStatus.SELFEMPLOYED],
      authorUID: '00000000-aaaa-bbbb-cccc-000000000001',
      answers: answersArray,
      taAddressRegion: Region.KHARKIV_REGION,
      draft: true,
      body: '',
      taAddressTown: '',
      taAddressDistrict: '',
      pollType: PollType.REGULAR,
      taAgeGroups: [AgeGroup.TWENTY],
      taGenders: [Gender.MALE, Gender.FEMALE],
      image: '00000000-aaaa-bbbb-cccc-000000000001',
    }

    // WHEN data will be validate
    const result = validator.validate(correctPoll)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })
})
