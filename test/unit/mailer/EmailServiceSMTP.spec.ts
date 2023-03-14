import 'reflect-metadata'

import { SentMessageInfo } from 'nodemailer'
import { container } from 'tsyringe'

import { Language } from '../../../src/iviche/common/Language'
import { UserRole } from '../../../src/iviche/common/UserRole'
import { ApplicationError } from '../../../src/iviche/error/ApplicationError'
import { EmailService } from '../../../src/iviche/mailer/EmailService'
import { EmailServiceSMTP } from '../../../src/iviche/mailer/EmailServiceSMTP'
import { MailerModule } from '../../../src/iviche/mailer/MailerModule'
import MailMessage from '../../../src/iviche/mailer/models/MailMessage'

// needed for mocking
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer')
jest.mock('nodemailer')

const mockedSendMailResponse = {
  accepted: ['some@test.mail'],
  rejected: [],
  response: '250 2.0.0 OK  1570479148 c4sm2888845lfm.4 - gsmtp',
  messageId: '<1421f4c9-a5b1-805c-ac6f-12919981e49b@MacBook-Pro-Becker.local>',
}

describe('EmailServiceSMTP', () => {
  beforeAll(async () => {
    await MailerModule.initialize()
    // nodemailer mocking
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn(async () => mockedSendMailResponse),
    })
  })
  test('sendMail()', async () => {
    // GIVEN: mail and mailer service
    const mail = new MailMessage({ subject: 'Test', text: 'Text' })
    const mailer = container.resolve<EmailService>('EmailService')
    // WHEN: sending mail
    const response: SentMessageInfo = await mailer.sendMail<SentMessageInfo>(
      '',
      ['some@test.mail'],
      mail,
    )
    // THEN: the mail has successfully delivered
    expect(response.accepted.length).toBe(1)
    expect(response.accepted[0]).toBe('some@test.mail')
    expect(response.rejected.length).toBe(0)
    expect(response.messageId).toBeDefined()
  })

  test('sendConfirmEmailCodeToUser Failed', async () => {
    // GIVEN mock for sendMail
    const sendMailMock = jest.fn().mockImplementation(() => {
      throw new Error('SMTP error')
    })
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock })

    // AND profile
    const profile = {
      user: { role: UserRole.PRIVATE, username: '123' },
      person: { email: '123' },
      details: {},
    }
    try {
      // WHEN send email
      await EmailServiceSMTP.prototype['sendConfirmEmailCodeIfNeeded'](profile, Language.UA)
    } catch (e) {
      //THEN catch expected error
      expect(e).toBeInstanceOf(ApplicationError)
    }
  })
})
