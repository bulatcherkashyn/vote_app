import { createTransport } from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

import { Language } from '../common/Language'
import { Profile } from '../profiles/models/Profile'
import EmailServiceConfig from './models/EmailServiceConfig'
import MailMessage from './models/MailMessage'

export abstract class EmailService {
  protected transporter: Mail

  protected constructor(config: EmailServiceConfig) {
    this.transporter = createTransport(config)
  }

  public abstract async sendMail<T>(
    from: string,
    receivers: Array<string>,
    message: MailMessage,
  ): Promise<T>

  public abstract async sendConfirmEmailCodeIfNeeded(
    profile: Profile,
    language?: Language,
  ): Promise<void>

  public abstract async sendPasswordRestorationCodeEmail(
    email: string,
    code: string,
    language?: Language,
  ): Promise<void>
}
