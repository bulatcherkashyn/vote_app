import 'reflect-metadata'

import { Gender } from '../../../../src/iviche/common/Gender'
import { SocialStatus } from '../../../../src/iviche/common/SocialStatus'
import { ValidationErrorCodes } from '../../../../src/iviche/error/DetailErrorCodes'
import { Person } from '../../../../src/iviche/person/model/Person'
import { PersonValidator } from '../../../../src/iviche/person/validator/PersonValidator'

const validator = new PersonValidator()

describe('Fail test Person validator ', () => {
  test('isLegalPerson false, error: legalName exists', () => {
    // GIVEN Person with legal name
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      legalName: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"legalName" is not allowed',
      source: 'legalName',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error shortName exists', () => {
    // GIVEN Person with short name
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      shortName: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"shortName" is not allowed',
      source: 'shortName',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: tagline exists', () => {
    // GIVEN Person with tagline
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      tagline: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"tagline" is not allowed',
      source: 'tagline',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: gender does not equal enum', () => {
    // GIVEN Person with wrong gender
    // as {} as Person is needed to hide that gender is not enum
    const falseLegalPerson: Person = ({
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      gender: 'bla',
    } as {}) as Person

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"gender" must be one of [MALE, FEMALE, UNSET]',
      source: 'gender',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: socialStatus is doesnt equal enum', () => {
    // GIVEN Person with wrong social status
    // as {} as Person is needed to hide that socialStatus is not enum
    const falseLegalPerson: Person = ({
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      socialStatus: 'bla',
    } as {}) as Person

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition.source).toBe('socialStatus')
    expect(result.errorDefinition.code).toBe(
      ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    )
    expect(result.errorDefinition.message).toBe(
      '"socialStatus" must be one of [CLERK, WORKER, MANAGER, UNEMPLOYED, SELFEMPLOYED, STUDENT, RETIREE, UNKNOWN]',
    )
  })

  test('isLegalPerson true, error: isPublicPerson must be true', () => {
    // GIVEN Person with isPublicPerson = false
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: false,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"isPublicPerson" must be [true]',
      source: 'isPublicPerson',
      code: ValidationErrorCodes.FIELD_VALUE_SHOULD_BE_IN_DICT_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: firstName exists', () => {
    // GIVEN Person with first name
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
      firstName: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"firstName" is not allowed',
      source: 'firstName',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: middleName exists', () => {
    // GIVEN Person with middle name
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
      middleName: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"middleName" is not allowed',
      source: 'middleName',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: lastName exists', () => {
    // GIVEN Person with last name
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
      lastName: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"lastName" is not allowed',
      source: 'lastName',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: jobTitle exists', () => {
    // GIVEN Person with job title
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
      jobTitle: 'bla',
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"jobTitle" is not allowed',
      source: 'jobTitle',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: legalName doesnt exist', () => {
    // GIVEN Person with legal name
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      shortName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"legalName" is required',
      source: 'legalName',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: shortName doesnt exist', () => {
    // GIVEN Person without shortName
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      phone: '+380440001122#001',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"shortName" is required',
      source: 'shortName',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: phone doesnt exist', () => {
    // GIVEN Person without phone
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      shortName: 'bla',
      birthdayAt: new Date('01.01.2000'),
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"phone" is required',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_REQUIRED_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: gender exists', () => {
    // GIVEN Person with birthdayAt
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      phone: '+380440001122#001',
      shortName: 'bla',
      birthdayAt: new Date('01.01.2000'),
      gender: Gender.FEMALE,
    }

    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"gender" is not allowed',
      source: 'gender',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson true, error: socialStatus exists', () => {
    // GIVEN Person with socialStatus
    const trueLegalPerson: Person = {
      isLegalPerson: true,
      isPublicPerson: true,
      email: 'test@test.com',
      legalName: 'bla',
      phone: '+380440001122#001',
      shortName: 'bla',
      birthdayAt: new Date('01.01.2000'),
      socialStatus: SocialStatus.CLERK,
    }
    // WHEN validate object
    const result = validator.validate(trueLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: '"socialStatus" is not allowed',
      source: 'socialStatus',
      code: ValidationErrorCodes.FIELD_FORBIDDEN_VALIDATION_ERROR,
    })
  })

  test('isLegalPerson false, error: phone has letters', () => {
    // GIVEN Person with wrong phone
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+380554q64544',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone number main part should consist of numbers only',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('isLegalPerson false, error: phone extension has has letters', () => {
    // GIVEN Person with wrong phone extension
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+380121231212#000q5',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone number extension part should consist of numbers only',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('isLegalPerson false, error: phone doesnt start with +380', () => {
    // GIVEN Person with wrong phone
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+320554564545565',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone number should start with +380 and consist of numbers and optional extension',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('isLegalPerson false, error: Phone extension start', () => {
    // GIVEN Person with wrong phone
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+3805545645457#001',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone number extension should start on 13 character',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })

  test('isLegalPerson false, error: Phone extension min length', () => {
    // GIVEN Person with wrong phone
    const falseLegalPerson: Person = {
      firstName: 'Petrik',
      lastName: 'Pyatochkin',
      isLegalPerson: false,
      email: 'test@test.com',
      phone: '+380554564545#',
    }

    // WHEN validate object
    const result = validator.validate(falseLegalPerson)

    // THEN got error
    expect(result.errorDefinition).toStrictEqual({
      message: 'Phone extension length must be at least 1 character long',
      source: 'phone',
      code: ValidationErrorCodes.FIELD_VALUE_DOES_NOT_MATCH_THE_PATTERN,
    })
  })
})
