import { PollWatchDTOTuple } from '../../../../src/iviche/pollWatch/dto/PollWatchDTOTuple'
import { ContactType } from '../../../../src/iviche/pollWatch/models/ContactType'

export const pollWatchTupleList: Array<PollWatchDTOTuple> = [
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000001',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000001',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000001',
    pollTitle: 'Some test title',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000002',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000002',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000002',
    pollTitle: 'Some test title 2',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000003',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000003',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000003',
    pollTitle: 'Some test title 3',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000004',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000004',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000004',
    pollTitle: 'Some test title 4',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000005',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000005',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000005',
    pollTitle: 'Some test title 5',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
  {
    uid: '00000000-aaaa-aaaa-aaaa-000000000006',
    userUID: '00000000-aaaa-aaaa-bbbb-000000000006',
    pollUID: '00000000-aaaa-aaaa-bbbb-000000000006',
    pollTitle: 'Some test title 6',
    createdAt: new Date(),
    contactType: ContactType.MANUAL,
  },
]
