import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { Person } from '../../../person/model/Person'

export class PersonModelConstructor implements ModelConstructor<Person, Person> {
  public constructRawForm(req: Request): Person {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): Person {
    const {
      isLegalPerson,
      isPublicPerson,
      firstName,
      middleName,
      lastName,
      jobTitle,
      legalName,
      shortName,
      tagline,
      phone,
      birthdayAt,
      username,
      gender,
      socialStatus,
      bio,
      addressRegion,
      addressDistrict,
      addressTown,
    } = req.body

    return {
      email: username,
      isLegalPerson,
      isPublicPerson,
      firstName,
      middleName,
      lastName,
      jobTitle,
      legalName,
      shortName,
      tagline,
      phone,
      birthdayAt,
      gender,
      socialStatus,
      bio,
      addressRegion,
      addressDistrict,
      addressTown,
    }
  }
}
