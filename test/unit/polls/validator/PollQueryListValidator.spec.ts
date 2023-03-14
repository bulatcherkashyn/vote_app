import 'reflect-metadata'

import { container } from 'tsyringe'

import { CompetencyTagServiceImpl } from '../../../../src/iviche/competencyTag/service/CompetencyTagServiceImpl'
import { PollQueryListForValidator } from '../../../../src/iviche/polls/models/PollQueryList'
import { PollQueryListValidator } from '../../../../src/iviche/polls/validators/PollQueryListValidator'

container.registerSingleton('CompetencyTagService', CompetencyTagServiceImpl)

const validator = new PollQueryListValidator()

const defaultParams = {
  offset: 0,
  limit: 100,
}

describe('PollQueryListValidator', () => {
  test('Only publishedAtStart exist', () => {
    const params: PollQueryListForValidator = {
      ...defaultParams,
      publishedAtStart: '2020-01-15',
    }

    const result = validator.validate(params)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('Only publishedAtEnd exist', () => {
    const params: PollQueryListForValidator = {
      ...defaultParams,
      publishedAtEnd: '2020-01-15',
    }

    const result = validator.validate(params)

    expect(result.hasError).toBeFalsy()
  })

  test('Default param with empty optional fields', () => {
    const params: PollQueryListForValidator = {
      ...defaultParams,
      title: '',
      taAddressRegion: '',
    }

    const result = validator.validate(params)

    expect(result.hasError).toBeFalsy()
  })

  test('publishedAtStart and publishedAtEnd exist. Success', () => {
    const params: PollQueryListForValidator = {
      ...defaultParams,
      publishedAtStart: '2020-01-14',
      publishedAtEnd: '2020-01-15',
    }

    const result = validator.validate(params)

    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('publishedAtStart and publishedAtEnd exist. Fail', () => {
    const params: PollQueryListForValidator = {
      ...defaultParams,
      publishedAtStart: '2020-01-15',
      publishedAtEnd: '2020-01-14',
    }

    const result = validator.validate(params)

    expect(result.hasError).toBeTruthy()
    expect(result.errorDefinition).toMatchObject({
      message: '"publishedAtStart" must be less than "ref:publishedAtEnd"',
      source: 'publishedAtStart',
      code: 400000,
    })
  })
})
