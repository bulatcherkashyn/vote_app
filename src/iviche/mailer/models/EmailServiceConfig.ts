interface Auth {
  user?: string
  pass?: string
}

interface EmailServiceConfig {
  pool?: boolean
  host?: string
  port?: number
  secure?: boolean
  auth?: Auth
}

export default EmailServiceConfig
