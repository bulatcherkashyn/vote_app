import { SentMessageInfo } from 'nodemailer'
import { inject, injectable } from 'tsyringe'

import { Language } from '../common/Language'
import { ApplicationError } from '../error/ApplicationError'
import { logger } from '../logger/LoggerFactory'
import { Profile } from '../profiles/models/Profile'
import { EmailService } from './EmailService'
import { EmailServiceSMTPConfig } from './models/EmailServiceSMTPConfig'
import MailMessage from './models/MailMessage'
import { emailTemplates } from './templates'

@injectable()
export class EmailServiceSMTP extends EmailService {
  constructor(@inject('EmailServiceSMTPConfig') config: EmailServiceSMTPConfig) {
    const { user, pass, host, port, secure } = config
    const opt = {
      host,
      port: port || 465,
      secure: secure || true,
      auth: { user, pass },
    }
    super(opt)
    logger.info(`SMTP transport to ${host} has been configured`)
  }

  public async sendMail(
    from: string,
    receivers: Array<string>,
    message: MailMessage,
  ): Promise<SentMessageInfo> {
    logger.debug('Sending has been started')
    const mailResponse = await this.transporter.sendMail({
      from: from || process.env.SMTP_USER || 'no-reply@iviche.com',
      to: receivers,
      ...message,
    })
    logger.debug('Sending has been done')
    return mailResponse
  }

  public async sendConfirmEmailCodeIfNeeded(
    profile: Profile,
    language: Language = Language.UA,
  ): Promise<void> {
    if (profile.details.emailConfirmed || !profile.person.email) {
      return
    }
    const { email } = profile.person
    const { emailConfirmationCode } = profile.details

    logger.debug(`email.sender.send.confirmation.email.start.for:[${email}]`)
    const mail = emailTemplates.welcome[language](email, emailConfirmationCode)

    try {
      await this.sendMail('', [email], mail)
    } catch (error) {
      logger.error(`auth.service.send.confirmation.email.error.for:[${email}]`, error)
      throw new ApplicationError('Something went wrong with SMTP service')
    }
    logger.debug(`email.sender.send.confirmation.email.done.for:[${email}]`)
  }

  public async sendPasswordRestorationCodeEmail(
    email: string,
    code: string,
    language: Language = Language.UA,
  ): Promise<void> {
    logger.debug(`email.sender.send.password-restoration-code.email.start.for:[${email}]`)
    const mail = emailTemplates.resetPassword[language](code)
    try {
      await this.sendMail('', [email], mail)
    } catch (error) {
      logger.error(`auth.service.send.password-restoration-code.error.for:[${email}]`, error)
      throw new ApplicationError('Something went wrong with SMTP service')
    }
    logger.debug(`email.sender.send.password-restoration-code.done.for:[${email}]`)
  }
}
