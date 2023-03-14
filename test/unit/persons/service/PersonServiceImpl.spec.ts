import 'reflect-metadata'

import { oneLine } from 'common-tags'
import { List } from 'immutable'

import { ServerError } from '../../../../src/iviche/error/ServerError'
import { PersonDAOImpl } from '../../../../src/iviche/person/db/PersonDAOImpl'
import { Person } from '../../../../src/iviche/person/model/Person'
import { PersonService } from '../../../../src/iviche/person/service/PersonService'
import { PersonServiceImpl } from '../../../../src/iviche/person/service/PersonServiceImpl'
import { EditOwnObjectACS, GrandAccessACS } from '../../../../src/iviche/security/acs/strategies'
import { KnexTestTracker } from '../../common/KnexTestTracker'

const knexTracker = new KnexTestTracker()
const personService: PersonService = new PersonServiceImpl(
  new PersonDAOImpl(),
  knexTracker.getTestConnection(),
)

describe('Person service CRUD tests', () => {
  beforeEach(() => {
    knexTracker.install()
  })

  // -----------------------------Create-----------------------------
  test('create person', async () => {
    // GIVEN person data to be saved
    const createPerson: Person = {
      isPublicPerson: true,
      email: 'testmail@test.com',
    }
    // AND expected save query
    knexTracker.mockSQL(
      oneLine`insert into "person"
      ("addressDistrict",
      "addressRegion",
      "addressTown",
      "bio",
      "birthdayAt",
      "createdAt",
      "email",
      "firstName",
      "gender",
      "isLegalPerson",
      "isPublicPerson",
      "jobTitle",
      "lastName",
      "legalName",
      "middleName",
      "phone",
      "shortName",
      "socialStatus",
      "tagline",
      "uid")
      values
      (DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      $1,
      $2,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      $3,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      DEFAULT,
      $4)`,
      {},
    )

    // WHEN person is saved
    const uid = await personService.save(createPerson, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  // -----------------------------UPDATE-----------------------------
  test('update person GrandAccessACS', async () => {
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
      oneLine`update "person" set "isLegalPerson" = $1, "firstName" = $2,
      "middleName" = $3, "lastName" = $4, "jobTitle" = $5,
      "legalName" = $6, "shortName" = $7, "email" = $8 where "uid" = $9`,
      1,
    )

    // WHEN person is saved
    const uid = await personService.save(updatePerson, new GrandAccessACS())

    // THEN we expect that tracker works fine and uid has been returned
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('update person EditOwnObjectACS (Really own data)', async () => {
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
    //  AND expected update query
    knexTracker.mockSQL(
      oneLine`
      update "person" set
      "isLegalPerson" = $1, "firstName" = $2, "middleName" = $3, "lastName" = $4,
      "jobTitle" = $5, "legalName" = $6, "shortName" = $7, "email" = $8
      where "uid" = $9 and "uid" in (select "personUID" from "users" where "uid" = $10)`,
      1,
    )

    // WHEN person is saved
    const uid = await personService.save(
      updatePerson,
      new EditOwnObjectACS('8903a771-6b26-4ada-a131-88defce07544'),
    )

    // THEN we expect that tracker works fine and uid has been generated
    expect(uid.length).toBe(36) // length of uuid4 is 36 symbols
  })

  test('update person EditOwnObjectACS (Not own data)', async () => {
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
            "uid" = $9
            and "uid" in
                (select "personUID"
                from "users"
                where "uid" = $10)`,
      0,
      false,
    )

    try {
      // WHEN person is saved
      await personService.save(updatePerson, new EditOwnObjectACS('FAKE'))
    } catch (e) {
      // THEN we expect that tracker works fine and finally we have caught ServerError
      expect(e).toBeInstanceOf(ServerError)
    }
  })

  // -----------------------------Delete-----------------------------
  test('delete person GrandAccessACS', async () => {
    // GIVEN person uid to be deleted
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected delete query
    knexTracker.mockSQL(
      oneLine`update "person"
      set "avatar" = $1,
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
      where "uid" = $20`,
      1,
    )

    // WHEN person is deleted
    await personService.delete(personUid, new GrandAccessACS())

    // THEN no errors occur
  })

  test('delete person EditOwnObjectACS (Really own data)', async () => {
    // GIVEN person uid to be deleted
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected delete query
    knexTracker.mockSQL(
      oneLine`update "person"
      set "avatar" = $1,
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
      where "uid" = $20`,
      1,
    )

    // WHEN person is deleted
    await personService.delete(
      personUid,
      new EditOwnObjectACS('8903a771-6b26-4ada-a131-88defce07544'),
    )

    // THEN no errors occur
  })

  test('delete person EditOwnObjectACS (Not own data)', async () => {
    // GIVEN person uid to be deleted
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected delete query

    knexTracker.mockSQL(
      oneLine`update "person"
      set "avatar" = $1,
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
      where "uid" = $20`,
      0,
      false,
    )

    try {
      // WHEN person is deleted
      await personService.delete(personUid, new EditOwnObjectACS('betterToUseLinux'))
    } catch (e) {
      // THEN we expect that tracker works fine and we have caught ServerError
      expect(e).toBeInstanceOf(ServerError)
    }
  })

  // -----------------------------Get-----------------------------
  test('load person GrandAccessACS', async () => {
    // GIVEN person uid to be loaded
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND expected person data
    const expectedPerson: Person = {
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

    // AND expected load query method
    knexTracker.mockSQL(
      oneLine`
        select *
        from "person"
        where
            "uid" = $1
            and "deletedAt" is null
        limit $2`,
      expectedPerson,
    )

    // WHEN person is loaded
    const loadedPerson = await personService.get(personUid, new GrandAccessACS())

    // THEN loaded data should be equal to the expected data
    expect(loadedPerson).toBe(expectedPerson)
  })

  test('load person EditOwnObjectACS (Really own data)', async () => {
    // GIVEN person uid to be loaded
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'
    // AND the expected person data
    const expectedPerson: Person = {
      uid: personUid,
      isLegalPerson: true,
      firstName: 'firstName1',
      middleName: 'middleName1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      legalName: 'legalName1',
      shortName: 'shortName1',
      email: 'testupdate@test.com',
    }
    // AND expected load query method
    knexTracker.mockSQL(
      oneLine`select * from "person" where "uid" = $1 and "deletedAt" is null
      and "uid" in (select "personUID" from "users"
      where "uid" = $2 and "deletedAt" is null) limit $3`,
      expectedPerson,
    )

    // WHEN person is loaded
    const loadedPerson = await personService.get(personUid, new EditOwnObjectACS(personUid))

    // THEN loaded data should be equal to the expected data
    expect(loadedPerson).toBe(expectedPerson)
  })

  test('load person EditOwnObjectACS (Not own data)', async () => {
    // GIVEN person uid to be loaded
    const personUid = '8903a771-6b26-4ada-a131-88defce07544'

    // AND expected load query method
    knexTracker.mockSQL(
      oneLine`
        select *
        from "person"
        where
            "uid" = $1
            and "deletedAt" is null
            and "uid" in
            (select "personUID"
             from "users"
             where
                "uid" = $2
                and "deletedAt" is null)
        limit $3`,
      undefined,
    )

    // WHEN person is loaded
    const loadedPerson = await personService.get(personUid, new EditOwnObjectACS('FAKEsS'))

    // THEN loaded data must be undefined (not found)
    expect(loadedPerson).toBe(undefined)
  })

  // -----------------------------LIST-----------------------------
  test('load page person list', async () => {
    // GIVEN expected persons list to be loaded
    const expectedPersonsList = {
      list: List([
        {
          uid: '00000000-0000-0000-0000-000000000001',
          isLegalPerson: true,
          firstName: 'firstName1',
          middleName: 'middleName1',
          lastName: 'lastName1',
          jobTitle: 'jobTitle1',
          legalName: 'legalName1',
          shortName: 'shortName1',
          email: 'testuser1@test.com',
        },
        {
          uid: '00000000-0000-0000-0000-000000000002',
          isLegalPerson: false,
          firstName: 'firstName2',
          middleName: 'middleName2',
          lastName: 'lastName2',
          jobTitle: 'jobTitle2',
          legalName: 'legalName2',
          shortName: 'shortName2',
          email: 'testuser2@test.com',
        },
      ]),
      metadata: { limit: 2, offset: 2, total: 4 },
    }

    // AND expected load query method
    knexTracker.mockSQL(
      [
        'select count("uid") from "person" where "deletedAt" is null limit $1',
        'select * from "person" where "deletedAt" is null limit $1 offset $2',
      ],
      [{ count: 4 }, expectedPersonsList.list.toArray()],
    )

    // WHEN list of person is loaded
    const loadedPersonList = await personService.list({ limit: 2, offset: 2 }, new GrandAccessACS())

    // THEN the loaded list must be equal to the expected
    expect(loadedPersonList).toEqual(expectedPersonsList)
  })

  afterEach(() => {
    knexTracker.uninstall()
  })
})
