import 'reflect-metadata'

import { oneLine } from 'common-tags'

import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { Person } from '../../../../src/iviche/person/model/Person'
import { PersonService } from '../../../../src/iviche/person/service/PersonService'
import { PersonServiceImpl } from '../../../../src/iviche/person/service/PersonServiceImpl'
import { GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const personService: PersonService = new PersonServiceImpl(
  new PersonDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('Person fail tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  test('update person fail. Not found', async () => {
    // GIVEN person to run update
    const updatePerson: Person = {
      uid: '8903a771-6b26-4ada-a131-88defce07544',
      isLegalPerson: true,
      firstName: 'firstName1',
      middleName: 'middleName1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      legalName: 'legalName1',
      shortName: 'shortName1',
      email: 'testupdate@test.com',
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      [
        oneLine`
        update "person"
        set
          "isLegalPerson" = $1,
          "firstName" = $2,
          "middleName" = $3,
          "lastName" = $4,
          "jobTitle" = $5,
          "legalName" = $6,
          "shortName" = $7,
          "email" = $8
        where
          "uid" = $9`,
      ],
      [0],
      false,
    )
    try {
      // WHEN person is saved
      await personService.save(updatePerson, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(404)
      expect(e.message).toBe('Not found [person] entity for update')
    }
  })

  test('update person fail. 2 rows was updated', async () => {
    // GIVEN person to run update
    const updatePerson: Person = {
      uid: '8903a771-6b26-4ada-a131-88defce07544',
      isLegalPerson: true,
      firstName: 'firstName1',
      middleName: 'middleName1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      legalName: 'legalName1',
      shortName: 'shortName1',
      email: 'testupdate@test.com',
    }
    //  AND expected update query method
    knexTracker.mockSQL(
      [
        oneLine`
        update "person"
        set
          "isLegalPerson" = $1,
          "firstName" = $2,
          "middleName" = $3,
          "lastName" = $4,
          "jobTitle" = $5,
          "legalName" = $6,
          "shortName" = $7,
          "email" = $8
        where
          "uid" = $9`,
      ],
      [2],
      false,
    )

    try {
      // WHEN person is saved
      await personService.save(updatePerson, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(400)
      expect(e.message).toBe('update for entity [person] failed')
    }
  })

  test('delete person. Not found', async () => {
    // GIVEN person uid to be deleted
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected delete query
    knexTracker.mockSQL(
      [
        oneLine`update
          "person"
        set
          "avatar" = $1,
          "isLegalPerson" = $2,
          "isPublicPerson" = $3,
          "firstName" = $4,
          "middleName" = $5,
          "lastName" = $6,
          "jobTitle" = $7,
          "legalName" = $8,
          "shortName" = $9,
          "tagline" = $10,
          "phone" = $11,
          "birthdayAt" = $12,
          "gender" = $13,
          "socialStatus" = $14,
          "bio" = $15,
          "addressRegion" = $16,
          "addressDistrict" = $17,
          "addressTown" = $18,
          "deletedAt" = $19
        where
          "uid" = $20`,
      ],
      [0],
      false,
    )
    try {
      // WHEN person is deleted
      await personService.delete(personUid, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(404)
      expect(e.message).toBe('Not found [person] entity for delete')
    }
  })

  test('delete person. 2 delete', async () => {
    // GIVEN person uid to be deleted
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected delete query
    knexTracker.mockSQL(
      [
        oneLine`update
          "person"
        set
          "avatar" = $1,
          "isLegalPerson" = $2,
          "isPublicPerson" = $3,
          "firstName" = $4,
          "middleName" = $5,
          "lastName" = $6,
          "jobTitle" = $7,
          "legalName" = $8,
          "shortName" = $9,
          "tagline" = $10,
          "phone" = $11,
          "birthdayAt" = $12,
          "gender" = $13,
          "socialStatus" = $14,
          "bio" = $15,
          "addressRegion" = $16,
          "addressDistrict" = $17,
          "addressTown" = $18,
          "deletedAt" = $19
        where
          "uid" = $20`,
      ],
      [2],
      false,
    )
    try {
      // WHEN person is deleted
      await personService.delete(personUid, new GrandAccessACS())
    } catch (e) {
      // THEN we expect error
      expect(e.httpCode).toBe(400)
      expect(e.message).toBe('delete for entity [person] failed')
    }
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
