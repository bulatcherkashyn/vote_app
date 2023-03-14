import crypto from 'crypto'

import { Gender } from '../../../src/iviche/common/Gender'
import { Region } from '../../../src/iviche/common/Region'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { AgeGroup } from '../../../src/iviche/polls/models/AgeGroup'
import { Vote } from '../../../src/iviche/voting/model/Vote'
import { VotingRoundType } from '../../../src/iviche/voting/model/VotingRoundType'

export function createHash(): string {
  return crypto
    .createHash('sha512')
    .update('I love cupcakes ' + new Date().getTime())
    .digest('hex')
}

export const testVotesList: Array<Vote> = [
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

    voterSeed: createHash(),
    roundStatus: VotingRoundType.DISCUSSION,
    createdAt: DateUtility.fromISO('2020-01-25'),

    ageGroup: AgeGroup.TWENTY,
    gender: Gender.MALE,
    socialStatus: SocialStatus.STUDENT,
    addressRegion: Region.KYIV_REGION,
    addressDistrict: 'boryspilskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

    voterSeed: createHash(),
    roundStatus: VotingRoundType.DISCUSSION,

    createdAt: DateUtility.fromISO('2020-01-25'),

    ageGroup: AgeGroup.TWENTY,
    gender: Gender.MALE,
    socialStatus: SocialStatus.STUDENT,
    addressRegion: Region.KYIV_REGION,
    addressDistrict: 'boryspilskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

    voterSeed: createHash(),
    createdAt: DateUtility.fromISO('2020-01-25'),
    roundStatus: VotingRoundType.DISCUSSION,

    ageGroup: AgeGroup.FIFTY_FIVE,
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.STUDENT,
    addressRegion: Region.POLTAVA_REGION,
    addressDistrict: 'kobeliatskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
    roundStatus: VotingRoundType.DISCUSSION,

    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-27'),

    ageGroup: AgeGroup.TWENTY,
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.STUDENT,
    addressRegion: Region.CHERNIHIV_REGION,
    addressTown: 'borzna_city',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
    roundStatus: VotingRoundType.DISCUSSION,

    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-23'),

    ageGroup: AgeGroup.THIRTY_FIVE,
    gender: Gender.UNSET,
    socialStatus: SocialStatus.RETIREE,
    addressRegion: Region.DNIPROPETROVSK_REGION,
    addressTown: 'apostolove_city',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
    roundStatus: VotingRoundType.DISCUSSION,

    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-24'),

    ageGroup: AgeGroup.FIFTY_SIX_PLUS,
    gender: Gender.MALE,
    socialStatus: SocialStatus.CLERK,
    addressRegion: Region.DNIPROPETROVSK_REGION,
    addressTown: 'vilnohirsk_city',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
    roundStatus: VotingRoundType.DISCUSSION,

    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-23'),

    ageGroup: AgeGroup.THIRTY_FIVE,
    gender: Gender.UNSET,
    socialStatus: SocialStatus.STUDENT,
    addressRegion: Region.IVANO_FRANKIVSK_REGION,
    addressDistrict: 'halytskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',
    roundStatus: VotingRoundType.DISCUSSION,

    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-23'),

    ageGroup: AgeGroup.FORTY_FIVE,
    gender: Gender.MALE,
    socialStatus: SocialStatus.RETIREE,
    addressRegion: Region.IVANO_FRANKIVSK_REGION,
    addressDistrict: 'halytskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

    roundStatus: VotingRoundType.DISCUSSION,
    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-23'),

    ageGroup: AgeGroup.THIRTY_FIVE,
    gender: Gender.UNSET,
    socialStatus: SocialStatus.MANAGER,
    addressRegion: Region.IVANO_FRANKIVSK_REGION,
    addressDistrict: 'halytskyi_district',
  },
  {
    pollAnswerUID: '00000000-aaaa-bbbb-cccc-000000000001',
    votingRoundUID: '00000000-aaaa-bbbb-cccc-000000000001',

    roundStatus: VotingRoundType.DISCUSSION,
    voterSeed: createHash(),

    createdAt: DateUtility.fromISO('2020-01-23'),

    ageGroup: AgeGroup.THIRTY_FIVE,
    gender: Gender.UNSET,
    socialStatus: SocialStatus.MANAGER,
    addressRegion: Region.IVANO_FRANKIVSK_REGION,
    addressDistrict: 'halytskyi_district',
  },
]
