import { Language } from '../../common/Language'
import { GenericEntity } from '../../generic/model/GenericEntity'

export interface UserDetails extends GenericEntity {
  googleId?: string
  facebookId?: string
  appleId?: string
  wpJournalistID?: number
  emailConfirmed?: boolean
  phoneConfirmed?: boolean
  emailConfirmationCode?: string
  phoneConfirmationCode?: number
  emailConfirmationCodeCreatedAt?: Date
  phoneConfirmationCodeCreatedAt?: Date
  notifyEmail?: boolean
  notifySMS?: boolean
  notifyTelegram?: boolean
  notifyViber?: boolean
  // TODO Design notification function setting
  notifyAboutNewPoll?: boolean
  linkFacebook?: string
  linkGoogle?: string
  linkApple?: string
  linkSite?: string
  newsPreferences?: JSON
  passwordRestorationCode?: string
  passwordRestorationCodeCreatedAt?: Date
  createdAt?: Date
  new?: boolean
  language?: Language
}
