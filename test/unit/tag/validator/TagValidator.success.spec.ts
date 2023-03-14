import 'reflect-metadata'

import { Tag } from '../../../../src/iviche/tag/model/Tag'
import { TagValidator } from '../../../../src/iviche/tag/validator/TagValidator'

const validator = new TagValidator()

describe('Tag validator. Successfully', () => {
  test('Tag valid', () => {
    const tags: Array<Tag> = [
      {
        value: 'Valid_Tag',
      },
      {
        value: 'Валидный_Тег',
      },
      {
        value: 'Валідний_Тег',
      },
      {
        value: 'Valid Tag With Spaces',
      },
      {
        value: 'Валидный тег с пробелами 123456rewq7890',
      },
    ]

    const resultEN = validator.validate(tags[0])
    const resultRU = validator.validate(tags[1])
    const resultUA = validator.validate(tags[2])
    const resultENWithSpaces = validator.validate(tags[3])
    const resultRUWithSpaces = validator.validate(tags[4])

    expect(resultEN.hasError).toBeFalsy()
    expect(resultRU.hasError).toBeFalsy()
    expect(resultUA.hasError).toBeFalsy()
    expect(resultENWithSpaces.hasError).toBeFalsy()
    expect(resultRUWithSpaces.hasError).toBeFalsy()
  })
})
