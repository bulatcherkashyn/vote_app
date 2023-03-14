import { personsList } from '../../../../database/seeds/01_InitialData'
import {
  administratorData,
  journalistData,
  legalUserData,
  moderatorData,
  primeAdminData,
} from '../../../common/TestUtilities'

export const profileList = [
  {
    person: {
      addressRegion: personsList[0].addressRegion,
      email: personsList[0].email,
      firstName: personsList[0].firstName,
      isLegalPerson: personsList[0].isLegalPerson,
      lastName: personsList[0].lastName,
      phone: personsList[0].phone,
      shortName: null,
      addressDistrict: null,
      addressTown: personsList[0].addressTown,
      birthdayAt: personsList[0].birthdayAt?.toISOString(),
      jobTitle: null,
      legalName: null,
      middleName: null,
    },
    user: {
      createdAt: null,
      password: '',
      role: primeAdminData.role,
      username: primeAdminData.username,
    },
  },
  {
    person: {
      addressRegion: personsList[1].addressRegion,
      email: personsList[1].email,
      firstName: personsList[1].firstName,
      isLegalPerson: personsList[1].isLegalPerson,
      lastName: personsList[1].lastName,
      phone: personsList[1].phone,
      shortName: null,
      addressDistrict: null,
      addressTown: personsList[1].addressTown,
      birthdayAt: personsList[1].birthdayAt?.toISOString(),
      jobTitle: null,
      legalName: null,
      middleName: null,
    },
    user: {
      createdAt: null,
      password: '',
      role: administratorData.role,
      username: administratorData.username,
    },
  },
  {
    person: {
      addressRegion: personsList[2].addressRegion,
      email: personsList[2].email,
      firstName: personsList[2].firstName,
      isLegalPerson: personsList[2].isLegalPerson,
      lastName: personsList[2].lastName,
      phone: personsList[2].phone,
      shortName: null,
      addressDistrict: personsList[2].addressDistrict,
      addressTown: null,
      birthdayAt: personsList[2].birthdayAt?.toISOString(),
      jobTitle: null,
      legalName: null,
      middleName: null,
    },
    user: {
      createdAt: null,
      password: '',
      role: journalistData.role,
      username: journalistData.username,
    },
  },
  {
    person: {
      addressRegion: personsList[3].addressRegion,
      email: personsList[3].email,
      firstName: personsList[3].firstName,
      isLegalPerson: personsList[3].isLegalPerson,
      lastName: personsList[3].lastName,
      phone: personsList[3].phone,
      shortName: null,
      addressDistrict: null,
      addressTown: personsList[3].addressTown,
      birthdayAt: personsList[3].birthdayAt?.toISOString(),
      jobTitle: null,
      legalName: null,
      middleName: null,
    },
    user: {
      createdAt: null,
      password: '',
      role: moderatorData.role,
      username: moderatorData.username,
    },
  },
  {
    person: {
      addressRegion: personsList[12].addressRegion,
      email: personsList[12].email,
      firstName: null,
      isLegalPerson: personsList[12].isLegalPerson,
      lastName: null,
      phone: personsList[12].phone,
      shortName: personsList[12].shortName,
      addressDistrict: null,
      addressTown: personsList[12].addressTown,
      birthdayAt: personsList[12].birthdayAt?.toISOString(),
      jobTitle: null,
      legalName: personsList[12].legalName,
      middleName: null,
    },
    user: {
      createdAt: null,
      password: '',
      role: legalUserData.role,
      username: legalUserData.username,
    },
  },
]
