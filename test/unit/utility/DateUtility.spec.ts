import { DateTime } from 'luxon'

import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'

describe('Date Utilities. Common', () => {
  test('now, Check if date really in 0UTC', () => {
    // GIVEN DateUtility
    // WHEN get current time
    const result = DateUtility.now()

    // THEN date must be in 0UTC timeZone
    const timeZoneOffset = DateTime.fromISO(result.toISOString(), { setZone: true })
    expect(timeZoneOffset.zoneName).toEqual('UTC')
  })

  test('fromISO: Check if date really convert to 0UTC', () => {
    // GIVEN DateUtility
    const localDate = DateTime.local().toISO()
    // WHEN get time form string
    const result = DateUtility.fromISO(localDate)

    // THEN date must be in 0UTC timeZone
    const timeZoneOffset = DateTime.fromISO(result.toISOString(), { setZone: true })
    expect(timeZoneOffset.zoneName).toEqual('UTC')
  })
})
