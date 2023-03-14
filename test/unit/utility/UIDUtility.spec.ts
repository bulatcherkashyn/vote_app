import 'reflect-metadata'

import { UIDUtility } from '../../../src/iviche/common/utils/UIDUtility'

describe('UIDUtility', () => {
  test('isStringHasUIDFormat success.', () => {
    const isStringHasUIDFormat = UIDUtility.isStringHasUIDFormat(
      '00000000-aaaa-aaaa-aaaa-000000000001',
    )

    expect(isStringHasUIDFormat).toBeTruthy()
  })

  test('isStringHasUIDFormat fail.', () => {
    const isStringHasUIDFormat = UIDUtility.isStringHasUIDFormat(
      '000000;0-aaaa-aaax-aaaq-000000000001',
    )

    expect(isStringHasUIDFormat).toBeFalsy()
  })
})
