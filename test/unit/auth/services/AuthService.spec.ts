import 'reflect-metadata'

import { DateTime } from 'luxon'

import { AuthServiceImpl } from '../../../../src/iviche/security/auth/services/AuthServiceImpl'

// NOTE: Mock nodemailer for avoiding SMTP error
const sendMailMock = jest.fn().mockImplementation(() => {
  throw new Error('SMTP error')
})
jest.mock('nodemailer')
// NOTE: this mock doesn't work with import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

describe('AuthService', () => {
  test('getRefreshTokenAge', () => {
    // GIVEN date which created 60 days earlier
    const createdAt = DateTime.utc()
      .minus({ days: 60 })
      .toJSDate()

    // WHEN get diff between dates
    const diff = AuthServiceImpl['getRefreshTokenAgeInDays'](createdAt)

    //THEN diff between date should be 60 days
    expect(diff.toFixed(5)).toEqual('60.00000')
  })
})
