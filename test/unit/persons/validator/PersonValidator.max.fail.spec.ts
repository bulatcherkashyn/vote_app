import 'reflect-metadata'

import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { Person } from '../../../../src/iviche/person/model/Person'
import { PersonValidator } from '../../../../src/iviche/person/validator/PersonValidator'
import { createRandomString } from '../../common/TestUtilities'

const validator = new PersonValidator()

describe('Fail test Person validator error: max values', () => {
  test('isLegalPerson true, error: legalName too long', () => {
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: createRandomString(256),
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"legalName" length must be less than or equal to 255 characters long',
      source: 'legalName',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: shortName too long', () => {
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: createRandomString(256),
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"shortName" length must be less than or equal to 255 characters long',
      source: 'shortName',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: tagline too long', () => {
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      tagline: createRandomString(1025),
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"tagline" length must be less than or equal to 1024 characters long',
      source: 'tagline',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: firstName too long', () => {
    const falseLegalPerson: Person = {
      isLegalPerson: false,
      email: 'test@test.com',
      firstName: createRandomString(256),
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"firstName" length must be less than or equal to 255 characters long',
      source: 'firstName',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: middleName too long', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      middleName: createRandomString(256),
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"middleName" length must be less than or equal to 255 characters long',
      source: 'middleName',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: lastName too long', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      isLegalPerson: false,
      email: 'test@test.com',
      lastName: createRandomString(256),
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"lastName" length must be less than or equal to 255 characters long',
      source: 'lastName',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: jobTitle too long', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      jobTitle: createRandomString(256),
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"jobTitle" length must be less than or equal to 255 characters long',
      source: 'jobTitle',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: phone too short', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+38055456454',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"phone" length must be at least 13 characters long',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_LENGTH_MIN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: phone with long extension', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+380554564545#0000568',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"phone" length must be less than or equal to 19 characters long',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_LENGTH_MAX_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: phone without extension too long', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+380554564545565',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone number without extension should have length less or equal to 13',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('isLegalPerson false, error: birthdayAt smaller than "01.01.1900"', () => {
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      birthdayAt: new Date('01.02.1890'),
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"birthdayAt" must be larger than or equal to "1900-01-01T00:00:00.000Z"',
      source: 'birthdayAt',
      code: ValidationErrorCodes.FIELD_DATA_MIN_VALIDATION_ERROR,
    })
  })
})
