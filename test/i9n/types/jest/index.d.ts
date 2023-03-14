declare namespace jest {
  interface Matchers<R> {
    // eslint-disable-next-line
    toBeStatusForUser(expected: number, username: string): CustomMatcherResult
  }
}
