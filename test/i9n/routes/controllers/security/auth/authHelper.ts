import { parse } from 'cookie'
import { Response } from 'supertest'

export const expectCorrectTokens = (response: Response): void => {
  const cookie = parse(response.header['set-cookie'][0])
  const token = cookie.token

  expect(token.split(' ')[0]).toEqual('jwt')
  expect(token.split(' ')[1]).toEqual(
    // Authorization token consist of schema(space)token itself
    // schema is jwt
    // token consists of A-Z, a-z, 0-9, (dot), (dash), (underscore)
    expect.stringMatching(/[A-Za-z0-9.\-_]+$/),
  )
  expect(response.body.refreshToken.length).toBe(36)
}
