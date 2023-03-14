import 'reflect-metadata'

import { TagUtility } from '../../../src/iviche/common/utils/TagUtility'
import { ServerError } from '../../../src/iviche/error/ServerError'

describe('TagUtility', () => {
  test('validateTagValues. Success', () => {
    // GIVEN Correct tags
    const correctTags = ['ANIME32', 'Едина_Країна', 'ELECTION']

    // WHEN validate correct tags
    TagUtility.validateTagValues(correctTags)

    // THEN Shouldn't catch an error
    expect(1).toBe(1)
  })

  test('validateTagValues. Failed incorrect character ","', () => {
    // GIVEN Incorrect tags
    const correctTags = ['ANIME32', '#Едина,Країна', '@ELECTION$$']

    // WHEN validate correct tags
    try {
      TagUtility.validateTagValues(correctTags)
      expect(1).toBe(2)
    } catch (e) {
      // THEN Should catch an error
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toBe('Incorrect tag pattern #Едина,Країна')
      expect(e.source).toBe('tags')
    }
  })

  test('validateTagValues. Failed incorrect character "汉字"', () => {
    // GIVEN Incorrect tags
    const correctTags = ['ANIME32', 'Едина_Країна', '@ELECTION$$汉字']

    // WHEN validate correct tags
    try {
      TagUtility.validateTagValues(correctTags)
      expect(1).toBe(2)
    } catch (e) {
      // THEN Should catch an error
      expect(e).toBeInstanceOf(ServerError)
      expect(e.message).toBe('Incorrect tag pattern @ELECTION$$汉字')
      expect(e.source).toBe('tags')
    }
  })
})
