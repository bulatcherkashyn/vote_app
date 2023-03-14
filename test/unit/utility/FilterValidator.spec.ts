import 'reflect-metadata'

import { ValidationErrorCodes } from '../../../src/iviche/error/DetailErrorCodes'
import { EntityFilter } from '../../../src/iviche/generic/model/EntityFilter'
import { FilterValidator } from '../../../src/iviche/generic/validator/FilterValidator'

const validator: FilterValidator = new FilterValidator()

describe('Pagination Utility', () => {
  test('success validate with order', async () => {
    const filer: EntityFilter = {
      limit: 2,
      offset: 2,
      order: { orderBy: 'uid', asc: true },
    }

    const res = validator.validate(filer)

    expect(res.hasError).toBeFalsy()
  })

  test('success validate without order', async () => {
    const filer: EntityFilter = {
      limit: 2,
      offset: 2,
    }

    const res = validator.validate(filer)

    expect(res.hasError).toBeFalsy()
  })

  test('fail validate limit < 1', async () => {
    const filer = {
      limit: -1,
      offset: 2,
    }

    const res = validator.validate(filer)

    expect(res.hasError).toBe(true)
    expect(res.errorDefinition).toStrictEqual({
      message: '"limit" must be larger than or equal to 1',
      source: 'limit',
      code: ValidationErrorCodes.FIELD_NUMBER_MIN_VALIDATION_ERROR,
    })
  })

  test('fail validate offset < 0', async () => {
    const filer = {
      limit: 20,
      offset: -1,
    }

    const res = validator.validate(filer)

    expect(res.hasError).toBe(true)
    expect(res.errorDefinition).toStrictEqual({
      message: '"offset" must be larger than or equal to 0',
      source: 'offset',
      code: ValidationErrorCodes.FIELD_NUMBER_MIN_VALIDATION_ERROR,
    })
  })

  test('fail validate limit > 1000', async () => {
    const filer = {
      limit: 1001,
      offset: 0,
    }

    const res = validator.validate(filer)

    expect(res.hasError).toBe(true)
    expect(res.errorDefinition).toStrictEqual({
      message: '"limit" must be less than or equal to 1000',
      source: 'limit',
      code: ValidationErrorCodes.FIELD_NUMBER_MAX_VALIDATION_ERROR,
    })
  })
})
