import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import Knex = require('knex')
import { Tag } from '../../../src/iviche/tag/model/Tag'

export const testTagData: Array<Tag> = [
  {
    uid: '00000001-caaa-bbbb-cccc-000000000001',
    value: 'Happy_new_election',
    lastUseAt: DateUtility.fromISO('2020-01-03T12:43:30.000Z'),
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  },
  {
    uid: '00000001-caaa-bbbb-cccc-000000000002',
    value: 'ГривнаПадает',
    lastUseAt: DateUtility.fromISO('2020-01-09T12:43:30.000Z'),
    createdAt: DateUtility.fromISO('2020-01-02T12:43:30.000Z'),
  },
  {
    uid: '00000001-caaa-bbbb-cccc-000000000003',
    value: 'ВсеХотят$$$',
    lastUseAt: DateUtility.fromISO('2020-01-08T12:43:30.000Z'),
    createdAt: DateUtility.fromISO('2020-01-03T12:43:30.000Z'),
  },
  {
    uid: '00000001-caaa-bbbb-cccc-000000000004',
    value: 'Все Хотят',
    lastUseAt: DateUtility.fromISO('2020-01-10T12:43:30.000Z'),
    createdAt: DateUtility.fromISO('2020-01-03T12:43:30.000Z'),
  },
]

export async function tagSeeds(knex: Knex): Promise<void> {
  await knex('tag').insert(testTagData)
}
