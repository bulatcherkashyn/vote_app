export class URLUtility {
  private static CHAR_CODE_UPPER_A = 'A'.charCodeAt(0)
  private static CHAR_CODE_LOWER_Z = 'z'.charCodeAt(0)
  private static CHAR_CODE_SPACE = ' '.charCodeAt(0)
  private static CHAR_CODE_0 = '0'.charCodeAt(0)
  private static CHAR_CODE_9 = '9'.charCodeAt(0)

  public static cleanupPhraseForLink(english: string): string {
    const result = []
    const phrase = english.toLocaleLowerCase()
    for (let i = 0; i < phrase.length; i++) {
      const charCode = phrase.charCodeAt(i)

      if (charCode === URLUtility.CHAR_CODE_SPACE) {
        // replace spaces with dashes
        result.push('-')
      } else if (
        // eslint-disable-next-line prettier/prettier
        (charCode > URLUtility.CHAR_CODE_UPPER_A && charCode <= URLUtility.CHAR_CODE_LOWER_Z)
        // eslint-disable-next-line prettier/prettier
          || (charCode >= URLUtility.CHAR_CODE_0 && charCode <= URLUtility.CHAR_CODE_9)) {

        // keep letters and numbers
        result.push(phrase.charAt(i))
      }
    }

    return result.join('')
  }
}
