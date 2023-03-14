import { Region } from '../../common/Region'
import { UserRole } from '../../common/UserRole'

export interface ProfileTuple {
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
  readonly username: string
  readonly role: UserRole
  readonly createdAt: Date
}
