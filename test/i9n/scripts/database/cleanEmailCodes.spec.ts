import 'reflect-metadata'

import Knex from 'knex'
import { DateTime } from 'luxon'
import { container } from 'tsyringe'

import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { cleanExpiredEmailConfirmationCodes } from '../../../../src/iviche/jobs/functions/cleanEmailCodes'
import { UserDetails } from '../../../../src/iviche/users/models/UserDetails'
import { TestContext } from '../../context/TestContext'

describe('Scheduler. Database scripts', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('cleanExpiredEmailCodeScript. clean 2 raw', async () => {
    // GIVEN correct user details with 2 expired email confirmation codes
    const dbData: Array<UserDetails> = [
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000010',
        emailConfirmationCode: 'test10',
        emailConfirmationCodeCreatedAt: DateUtility.now(),
      },
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000011',
        emailConfirmationCode: 'test11',
        emailConfirmationCodeCreatedAt: DateUtility.fromISO('1970-07-07T00:00:00.000Z'),
      },
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000012',
        emailConfirmationCode: 'test12',
        emailConfirmationCodeCreatedAt: DateTime.local()
          .minus({ days: 1 })
          .toUTC()
          .toJSDate(),
      },
    ]
    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('user_details').insert(dbData)

    // WHEN cleanExpiredEmailCodeScript is running
    await cleanExpiredEmailConfirmationCodes(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const check = await knex('user_details').select('*')

    // AND emailConfirmationCode will change to null, where email confirmation code is expired (life time of one day)
    check.forEach((detail: UserDetails) => {
      if (detail.uid === dbData[0].uid) {
        expect(detail.emailConfirmationCode).not.toBeNull()
      }

      if (detail.uid === dbData[1].uid) {
        expect(detail.emailConfirmationCode).toBeNull()
      }

      if (detail.uid === dbData[2].uid) {
        expect(detail.emailConfirmationCode).toBeNull()
      }
    })
  })

  test('cleanExpiredEmailCodeScript. nothing to clean', async () => {
    // GIVEN correct user details
    const dbData: UserDetails = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000014',
      emailConfirmationCode: 'test14',
      emailConfirmationCodeCreatedAt: DateUtility.now(),
    }

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('user_details').insert(dbData)

    // WHEN cleanExpiredEmailCodeScript is running
    await cleanExpiredEmailConfirmationCodes(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const result = await knex('user_details')
      .select('*')
      .where('uid', dbData.uid)

    // AND emailConfirmationCode field is not cleared
    expect(result[0].emailConfirmationCode).not.toBeNull()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
