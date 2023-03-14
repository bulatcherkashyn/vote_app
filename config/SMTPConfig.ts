import { EmailServiceSMTPConfig } from '../src/iviche/mailer/models/EmailServiceSMTPConfig'

export const SMTPConfig: EmailServiceSMTPConfig = {
  host: process.env.SMTP_HOST as string,
  user: process.env.SMTP_USER as string,
  pass: process.env.SMTP_PASSWORD as string,
}
