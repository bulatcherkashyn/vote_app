import { ApplicationError } from '../../../src/iviche/error/ApplicationError'

describe('ApplicationError', () => {
  test('ApplicationError without code', () => {
    try {
      throw new ApplicationError('Some error')
    } catch (e) {
      expect(e.errorCode).toBe(500)
    }
  })

  test('ApplicationError with code', () => {
    try {
      throw new ApplicationError('Some error', 503)
    } catch (e) {
      expect(e.errorCode).toBe(503)
    }
  })
})
