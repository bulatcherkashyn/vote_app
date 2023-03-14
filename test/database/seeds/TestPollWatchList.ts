import * as Knex from 'knex'

import { ContactType } from '../../../src/iviche/pollWatch/models/ContactType'
import PollWatch from '../../../src/iviche/pollWatch/models/PollWatch'
import { usersList } from './01_InitialData'
import { testPollsList } from './TestPollsList'

export const testPollWatchList: Array<PollWatch> = [
  {
    uid: '00000000-baaa-bbbb-cccc-000000000001',
    pollUID: testPollsList[0].uid as string,
    pollTitle: testPollsList[0].title,
    userUID: usersList[0].uid as string,
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000001',
    pollUID: testPollsList[1].uid as string,
    pollTitle: testPollsList[1].title,
    userUID: usersList[1].uid as string,
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000002',
    pollUID: testPollsList[2].uid as string,
    pollTitle: testPollsList[2].title,
    userUID: usersList[2].uid as string,
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000003',
    pollUID: testPollsList[3].uid as string,
    pollTitle: testPollsList[3].title,
    userUID: usersList[3].uid as string,
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-bbbb-cccc-000000000004',
    pollUID: testPollsList[4].uid as string,
    pollTitle: testPollsList[4].title,
    userUID: usersList[4].uid as string,
    contactType: ContactType.MANUAL,
  },
]

export async function pollWatchSeed(knex: Knex): Promise<void> {
  await knex('poll').insert(testPollsList)
  await knex('poll_watch').insert(testPollWatchList)
}
