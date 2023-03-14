export const createRandomString = (stringLength: number): string => {
  let randomString = ''
  let randomASCII
  for (let i = 0; i < stringLength; i++) {
    randomASCII = Math.floor(Math.random() * 25 + 97)
    randomString += String.fromCharCode(randomASCII)
  }
  return randomString
}
