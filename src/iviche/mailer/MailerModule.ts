import { container } from 'tsyringe'

import { SMTPConfig } from '../../../config/SMTPConfig'
import { logger } from '../logger/LoggerFactory'
import { EmailService } from './EmailService'
import { EmailServiceSMTP } from './EmailServiceSMTP'
import { EmailServiceSMTPConfig } from './models/EmailServiceSMTPConfig'

export class MailerModule {
  static async initialize(): Promise<void> {
    container.register<EmailServiceSMTPConfig>('EmailServiceSMTPConfig', { useValue: SMTPConfig })
    container.registerSingleton<EmailService>('EmailService', EmailServiceSMTP)
    logger.debug('app.context.mailer.module.initialized')
  }
}
