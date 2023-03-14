export interface EmailServiceSMTPConfig {
  user: string
  pass: string
  host: string
  port?: number
  secure?: boolean
}
