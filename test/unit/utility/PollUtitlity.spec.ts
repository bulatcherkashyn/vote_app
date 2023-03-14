import { List } from 'immutable'

import { PollUtility } from '../../../src/iviche/common/PollUtility'
import { Region } from '../../../src/iviche/common/Region'
import { Theme } from '../../../src/iviche/common/Theme'
import { Poll } from '../../../src/iviche/polls/models/Poll'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../src/iviche/polls/models/PollType'

describe('Poll Utilities. Common', () => {
  test('verifyPollOnAllowedStatus successfully (DRAFT)', () => {
    // GIVEN correct poll data with status DRAFT
    const poll: Poll = {
      status: PollStatus.DRAFT,
      anonymous: true,
      complexWorkflow: false,
      authorUID: 'some uid',
      body: 'test body',
      title: 'test title',
      tags: List(),
      taGenders: List(),
      taAgeGroups: List(),
      competencyTags: List(),
      taSocialStatuses: List(),
      theme: Theme.AGRICULTURE,
      votingStartAt: new Date('01.02.2020'),
      votingEndAt: new Date('02.02.2020'),
      answers: List(),
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }
    // WHEN verify poll status
    const result = PollUtility.verifyAllowedPollStatusForSave(poll)

    // THEN expect true
    expect(result).toBeTruthy()
  })

  test('verifyPollOnAllowedStatus successfully (REJECTED)', () => {
    // GIVEN correct poll data with status REJECTED
    const poll: Poll = {
      status: PollStatus.REJECTED,
      anonymous: true,
      complexWorkflow: false,
      authorUID: 'some uid',
      body: 'test body',
      title: 'test title',
      tags: List(),
      taGenders: List(),
      taAgeGroups: List(),
      competencyTags: List(),
      taSocialStatuses: List(),
      theme: Theme.AGRICULTURE,
      votingStartAt: new Date('01.02.2020'),
      votingEndAt: new Date('02.02.2020'),
      answers: List(),
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN verify poll status
    const result = PollUtility.verifyAllowedPollStatusForSave(poll)

    // THEN expect true
    expect(result).toBeTruthy()
  })

  test('verifyPollOnAllowedStatus fail (MODERATION)', () => {
    // GIVEN correct poll data with status MODERATION
    const poll: Poll = {
      status: PollStatus.MODERATION,
      anonymous: true,
      complexWorkflow: false,
      authorUID: 'some uid',
      body: 'test body',
      title: 'test title',
      tags: List(),
      taGenders: List(),
      taAgeGroups: List(),
      competencyTags: List(),
      taSocialStatuses: List(),
      theme: Theme.AGRICULTURE,
      votingStartAt: new Date('01.02.2020'),
      votingEndAt: new Date('02.02.2020'),
      answers: List(),
      taAddressRegion: Region.KHARKIV_REGION,
      pollType: PollType.REGULAR,
      image: '00000000-test-image-uuid-000000000001',
    }

    // WHEN verify poll status
    const result = PollUtility.verifyAllowedPollStatusForSave(poll)

    // THEN expect false
    expect(result).toBeFalsy()
  })
})
