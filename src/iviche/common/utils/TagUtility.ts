import { ValidationErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'

export class TagUtility {
  // Only letters (cyrillic latin), numbers and symbols -> _ҐІЇЄґії
  public static CORRECT_TAG_PATTERN = /^[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+(\s[A-Za-z0-9А-Яа-я_'ҐІЇЄєґії]+)*$/

  public static validateTagValues(tagValues: Array<string>): void {
    tagValues.forEach(tagValue => {
      const isCorrect = TagUtility.CORRECT_TAG_PATTERN.test(tagValue)
      if (!isCorrect) {
        throw new ServerError(
          `Incorrect tag pattern ${tagValue}`,
          400,
          ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
          'tags',
        )
      }
    })
  }
}
