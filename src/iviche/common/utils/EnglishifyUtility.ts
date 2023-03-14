type ReplacementDefinition = {
  [key: string]: string
}

export class EnglishifyUtility {
  private static ukrainianReplacement: ReplacementDefinition = {
    /* eslint-disable prettier/prettier */
    'А': 'A',
    'Б': 'B',
    'В': 'V',
    'Г': 'H',
    'Ґ': 'G',
    'Д': 'D',
    'Е': 'E',
    'Є': 'Ye',
    'Ж': 'Zh',
    'З': 'Z',
    'И': 'Y',
    'І': 'I',
    'Ї': 'Yi',
    'Й': 'Y',
    'К': 'K',
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'Kh',
    'Ц': 'Ts',
    'Ч': 'Ch',
    'Ш': 'Sh',
    'Щ': 'Shch',
    'Ю': 'Yu',
    'Я': 'Ya',
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'h',
    'ґ': 'g',
    'д': 'd',
    'е': 'e',
    'є': 'ie',
    'ж': 'zh',
    'з': 'z',
    'и': 'y',
    'і': 'i',
    'ї': 'i',
    'й': 'i',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'kh',
    'ц': 'ts',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'shch',
    'ь': '',
    'ю': 'iu',
    'я': 'ia',
    "'": '',
    /* eslint-enable prettier/prettier */
  }

  public static englishifyUkrainian(ukr: string): string {
    const result = []
    ukr = ukr.replace('зг', 'zgh')
    ukr = ukr.replace('Зг', 'Zgh')

    for (let i = 0; i < ukr.length; i++) {
      const char = ukr.charAt(i)

      if (EnglishifyUtility.ukrainianReplacement[char] !== undefined) {
        result.push(EnglishifyUtility.ukrainianReplacement[char])
      } else {
        result.push(char)
      }
    }

    return result.join('')
  }
}
