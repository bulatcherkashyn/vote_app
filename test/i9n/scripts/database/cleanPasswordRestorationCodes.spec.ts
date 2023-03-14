import 'reflect-metadata'

import Knex from 'knex'
import { DateTime } from 'luxon'
import { container } from 'tsyringe'

import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { DBConnection } from '../../../../src/iviche/db/DBConnection'
import { cleanExpiredPasswordRestorationCodes } from '../../../../src/iviche/jobs/functions/cleanPasswordRestorationCodes'
import { UserDetails } from '../../../../src/iviche/users/models/UserDetails'
import { TestContext } from '../../context/TestContext'

describe('Scheduler. Database scripts', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('cleanExpiredPasswordRestorationCodeScript. clean 2 raw', async () => {
    // GIVEN correct user details with 2 expired password restoration codes
    const dbData: Array<UserDetails> = [
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000010',
        passwordRestorationCode: 'test10',
        passwordRestorationCodeCreatedAt: DateUtility.now(),
      },
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000011',
        passwordRestorationCode: 'test11',
        passwordRestorationCodeCreatedAt: DateUtility.fromISO('1970-07-07T00:00:00.000Z'),
      },
      {
        uid: '00000000-aaaa-aaaa-aaaa-000000000012',
        passwordRestorationCode: 'test12',
        passwordRestorationCodeCreatedAt: DateTime.local()
          .minus({ days: 1 })
          .toUTC()
          .toJSDate(),
      },
    ]
    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('user_details').insert(dbData)

    // WHEN cleanExpiredPasswordRestorationCodesScript is running
    await cleanExpiredPasswordRestorationCodes(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const check = await knex('user_details').select('*')

    // AND passwordRestorationCode will change to null, where password restoration code is expired (life time of one day)
    check.forEach((detail: UserDetails) => {
      if (detail.uid === dbData[0].uid) {
        expect(detail.passwordRestorationCode).not.toBeNull()
      }

      if (detail.uid === dbData[1].uid) {
        expect(detail.passwordRestorationCode).toBeNull()
      }

      if (detail.uid === dbData[2].uid) {
        expect(detail.passwordRestorationCode).toBeNull()
      }
    })
  })

  test('cleanExpiredPasswordRestorationCodeScript. nothing to clean', async () => {
    // GIVEN correct user details
    const dbData: UserDetails = {
      uid: '00000000-aaaa-aaaa-aaaa-000000000014',
      passwordRestorationCode: 'test14',
      passwordRestorationCodeCreatedAt: DateUtility.now(),
    }

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND insert dbData
    await knex('user_details').insert(dbData)

    // WHEN cleanExpiredPasswordRestorationCodesScript is running
    await cleanExpiredPasswordRestorationCodes(new DBConnection().getConnection())

    // THEN get data from db for expecting
    const result = await knex('user_details')
      .select('*')
      .where('uid', dbData.uid)

    // AND passwordRestorationCode field is not cleared
    expect(result[0].passwordRestorationCode).not.toBeNull()
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
