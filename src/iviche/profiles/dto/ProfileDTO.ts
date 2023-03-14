import { Language } from '../../common/Language'
import { Region } from '../../common/Region'
import { UserRole } from '../../common/UserRole'
import { UserSystemStatus } from '../../users/models/UserSystemStatus'

export interface ProfileDTO {
  readonly uid?: string
  readonly isPublicPerson: boolean
  readonly isLegalPerson: boolean
  readonly firstName: string
  readonly middleName: string
  readonly lastName: string
  readonly jobTitle: string
  readonly legalName: string
  readonly shortName: string
  readonly email: string
  readonly phone: string
  readonly birthdayAt: Date
  readonly addressRegion: Region
  readonly addressDistrict: string
  readonly addressTown: string
  readonly tagline: string
  readonly gender: string
  readonly socialStatus: string
  readonly bio: string
  readonly username: string
  readonly role: UserRole
  readonly systemStatus: UserSystemStatus
  readonly emailConfirmed: boolean
  readonly phoneConfirmed: boolean
  readonly notifyViber: boolean
  readonly notifyTelegram: boolean
  readonly notifySMS: boolean
  readonly notifyEmail: boolean
  readonly notifyAboutNewPoll: boolean
  readonly avatar: string
  readonly wpJournalistID?: number
  readonly googleId?: string
  readonly facebookId?: string
  readonly appleId?: string
  readonly language?: Language
}
