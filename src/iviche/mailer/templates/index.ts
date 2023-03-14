import { MailTemplates } from '../models/MailTemplateTypes'
import { ResetPasswordENGTemplate } from './ResetPassword/ResetPasswordTemplate.EN'
import { ResetPasswordRUTemplate } from './ResetPassword/ResetPasswordTemplate.RU'
import { ResetPasswordUATemplate } from './ResetPassword/ResetPasswordTemplate.UA'
import { WelcomeENGTemplate } from './Welcome/WelcomeTemplate.EN'
import { WelcomeRUTemplate } from './Welcome/WelcomeTemplate.RU'
import { WelcomeUATemplate } from './Welcome/WelcomeTemplate.UA'

export const emailTemplates: MailTemplates = {
  welcome: {
    EN: WelcomeENGTemplate,
    RU: WelcomeRUTemplate,
    UA: WelcomeUATemplate,
  },
  resetPassword: {
    EN: ResetPasswordENGTemplate,
    RU: ResetPasswordRUTemplate,
    UA: ResetPasswordUATemplate,
  },
}
