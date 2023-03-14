import 'reflect-metadata'

import { Person } from '../../../../src/iviche/person/model/Person'
import { PersonValidator } from '../../../../src/iviche/person/validator/PersonValidator'

const validator = new PersonValidator()

describe('Test Person validator', () => {
  test('phone valid', () => {
    // GIVEN valid person with phone
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      phone: '+380661231212#00002',
      email: 'test@test.com',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })

  test('basic person valid', () => {
    // GIVEN valid person non legal person
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })

  test('basic person valid with empty optional fields', () => {
    // GIVEN valid person with empty optional fields and non legal person
    const falseLegalPerson: Person = {
      isLegalPerson: false,
      email: '',
      firstName: 'Petrik',
      middleName: '',
      lastName: 'Pyatochkin',
      jobTitle: '',
      bio: '',
      addressDistrict: '',
      addressTown: '',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })

  test('legal person valid', () => {
    // GIVEN valid legal person
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })

  test('legal person valid with epmty optional fields', () => {
    // GIVEN valid legal person with epmty optional fields
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
      tagline: '',
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })
})
