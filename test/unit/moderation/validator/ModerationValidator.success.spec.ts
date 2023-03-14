import 'reflect-metadata'

import { Moderation } from '../../../../src/iviche/moderation/model/Moderation'
import { ModerationResolutionType } from '../../../../src/iviche/moderation/model/ModerationResolutionType'
import { ModerationResolutionValidator } from '../../../../src/iviche/moderation/validator/ModerationValidator'
import { moderatorData } from '../../../i9n/common/TestUtilities'

const validator = new ModerationResolutionValidator()

describe('Moderation validator. Successfully', () => {
  test('Moderation valid', () => {
    // GIVEN Moderation case
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      moderatorUID: moderatorData.uid,
      resolution: ModerationResolutionType.PENDING,
      concern: 'Test',
      lockingCounter: 0,
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })
  test('Moderation valid. Resolution is not Rejected and concern is empty', () => {
    // GIVEN Moderation case
    const moderationCase = {
      uid: '00000000-aaaa-aaaa-cccc-000000000001',
      moderatorUID: moderatorData.uid,
      resolution: ModerationResolutionType.PENDING,
      concern: '',
      lockingCounter: 0,
    }

    // WHEN validate
    const result = validator.validate(moderationCase as Moderation)

    // THEN dont has errors
    expect(result.hasError).toBeFalsy()
  })
})
