import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { GenericEntity } from '../../generic/model/GenericEntity'

export interface Person extends GenericEntity {
  readonly email?: string
  readonly isLegalPerson?: boolean
  readonly isPublicPerson?: boolean
  readonly firstName?: string
  readonly middleName?: string
  readonly lastName?: string
  readonly jobTitle?: string
  readonly legalName?: string
  readonly shortName?: string
  readonly tagline?: string
  readonly phone?: string
  readonly birthdayAt?: Date
  readonly gender?: Gender
  readonly socialStatus?: SocialStatus
  readonly bio?: string
  readonly addressRegion?: Region
  readonly addressDistrict?: string
  readonly addressTown?: string
  readonly createdAt?: Date
  readonly avatar?: string
}
