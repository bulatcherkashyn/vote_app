import 'reflect-metadata'

import { createRequest, createResponse } from 'node-mocks-http'

import { finalErrorHandler } from '../../../src/iviche/common/express/ErrorHandler'
import { ApplicationError } from '../../../src/iviche/error/ApplicationError'
import { ServerError } from '../../../src/iviche/error/ServerError'

describe('Exception System tests', () => {
  test('Test of handling ServerError', async () => {
    // GIVEN mocked request and response
    const req = createRequest()
    const res = createResponse()

    // WHEN ServerError is handled
    finalErrorHandler(
      new ServerError('expected test error; panic mode off', 503),
      req,
      res,
      error => {
        // THEN we expect that no object will be thrown
        expect(!error)
      },
    )

    // AND that error message to be sent and response statusCode to be 500
    expect(res.statusCode).toBe(503)
    expect(res._getData()).toStrictEqual({
      message: 'expected test error; panic mode off',
      code: 503000,
      source: 'unknown',
    })
  })

  test('Test of handling ApplicationError', async () => {
    // GIVEN mocked request and response
    const req = createRequest()
    const res = createResponse()

    // WHEN ApplicationError is handled
    finalErrorHandler(
      new ApplicationError('expected test error; panic mode off'),
      req,
      res,
      error => {
        // THEN we expect that no object will be thrown
        expect(!error)
      },
    )

    // AND that error message to be sent and response statusCode to be 500
    expect(res.statusCode).toBe(500)
    expect(res._getData()).toStrictEqual({
      code: 500000,
      message: 'expected test error; panic mode off',
      source: 'unknown',
    })
  })

  test('Test of handling unexpectedError', async () => {
    // GIVEN mocked request and response
    const req = createRequest()
    const res = createResponse()

    // WHEN Error is handled
    finalErrorHandler(new Error('expected test error; panic mode off'), req, res, error => {
      // THEN we expect that thrown object will be passed into next() function
      expect(error instanceof Error)
      expect(error.message).toEqual('expected test error; panic mode off')
    })

    // AND that error message to be sent and response statusCode to be 500
    expect(res.statusCode).toBe(500)
    expect(res._getData()).toStrictEqual({
      code: 500000,
      message: 'Unexpected server error',
      source: 'unknown',
    })
  })

  test('Test of handling unexpected thrown-object', async () => {
    // GIVEN mocked request and response
    const req = createRequest()
    const res = createResponse()

    // WHEN Thrown object is handled
    finalErrorHandler({ message: 'expected test error; panic mode off' }, req, res, error => {
      // THEN we expect that thrown object will be passed into next() function
      expect(error).toEqual({ message: 'expected test error; panic mode off' })
    })

    // AND we expect that error message to be sent and response statusCode to be 500
    expect(res.statusCode).toBe(500)
    expect(res._getData()).toStrictEqual({
      code: 500000,
      message: 'Unexpected server error',
      source: 'unknown',
    })
  })
})
