import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { UserRole } from '../../common/UserRole'
import { DateUtility } from '../../common/utils/DateUtility'
import { logger } from '../../logger/LoggerFactory'
import { UserSystemStatus } from '../../users/models/UserSystemStatus'
import { Profile } from '../models/Profile'

const isEmailConfirmed = (modelObject: Profile): boolean => {
  return (
    modelObject.person.email !== undefined &&
    modelObject.details.emailConfirmed !== undefined &&
    modelObject.details.emailConfirmed
  )
}

const isPhoneConfirmed = (modelObject: Profile): boolean => {
  return (
    modelObject.person.phone !== undefined &&
    modelObject.details.phoneConfirmed !== undefined &&
    modelObject.details.phoneConfirmed
  )
}

const checkLegalDate = (modelObject: Profile): boolean => {
  const { birthdayAt } = modelObject.person
  if (birthdayAt) {
    const diff = DateUtility.getDateDiff(birthdayAt, DateUtility.now(), ['days']).days as number
    return diff >= 1
  }
  return false
}

const checkPrivateDate = (modelObject: Profile): boolean => {
  const { birthdayAt } = modelObject.person
  if (birthdayAt) {
    const diff = DateUtility.getDateDiff(birthdayAt, DateUtility.now(), ['year']).years as number
    return diff >= 18
  }
  return false
}

const getLegalSystemStatus = (modelObject: Profile): UserSystemStatus => {
  const { legalName, shortName, addressRegion, addressDistrict, addressTown } = modelObject.person

  const limitedAccess = legalName && shortName && isEmailConfirmed(modelObject)
  const addressRegionCheck = addressRegion && addressRegion !== Region.UNKNOWN

  if (
    limitedAccess &&
    isPhoneConfirmed(modelObject) &&
    checkLegalDate(modelObject) &&
    addressRegionCheck &&
    (addressDistrict || addressTown)
  ) {
    return UserSystemStatus.ACTIVE
  }

  if (limitedAccess) {
    return UserSystemStatus.LIMITED
  }

  return UserSystemStatus.SUSPENDED
}

const getPrivateSystemStatus = (modelObject: Profile): UserSystemStatus => {
  const {
    gender,
    socialStatus,
    addressRegion,
    addressDistrict,
    addressTown,
    firstName,
    lastName,
  } = modelObject.person

  const limitedAccess = firstName && lastName && isEmailConfirmed(modelObject)
  const genderCheck = gender && gender !== Gender.UNSET
  const socialStatusCheck = socialStatus && socialStatus !== SocialStatus.UNKNOWN
  const addressRegionCheck = addressRegion && addressRegion !== Region.UNKNOWN

  if (
    limitedAccess &&
    isPhoneConfirmed(modelObject) &&
    checkPrivateDate(modelObject) &&
    genderCheck &&
    socialStatusCheck &&
    addressRegionCheck &&
    (addressDistrict || addressTown)
  ) {
    return UserSystemStatus.ACTIVE
  }

  if (limitedAccess) {
    return UserSystemStatus.LIMITED
  }

  return UserSystemStatus.SUSPENDED
}

export const getSystemStatus = (modelObject: Profile): UserSystemStatus => {
  logger.debug('getSystemStatus.start')

  const { role } = modelObject.user
  return role === UserRole.LEGAL
    ? getLegalSystemStatus(modelObject)
    : getPrivateSystemStatus(modelObject)
}
