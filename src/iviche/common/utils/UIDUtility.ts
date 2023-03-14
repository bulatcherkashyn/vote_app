export class UIDUtility {
  public static CORRECT_UID_PATTERN = /^([A-Fa-f0-9]{8})-([A-Fa-f0-9]{4})-([A-Fa-f0-9]{4})-([A-Fa-f0-9]{4})-([A-Fa-f0-9]{12})$/

  public static isStringHasUIDFormat(stringToCheck: string): boolean {
    if (!stringToCheck) {
      return false
    }

    const isMatchingFormat = stringToCheck.match(UIDUtility.CORRECT_UID_PATTERN)
    return !!isMatchingFormat
  }
}
