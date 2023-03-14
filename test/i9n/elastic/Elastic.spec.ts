import 'reflect-metadata'

import * as esb from 'elastic-builder'
import { container } from 'tsyringe'

import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { sleep } from '../../unit/utility/sleep'
import { TestContext } from '../context/TestContext'

import SpyInstance = jest.SpyInstance
import { ResponseError } from '@elastic/elasticsearch/lib/errors'

import { ConflictErrorCodes } from '../../../src/iviche/error/DetailErrorCodes'
import { ServerError } from '../../../src/iviche/error/ServerError'

describe('Elastic client', () => {
  let spy: SpyInstance

  beforeAll(async done => {
    await TestContext.initialize()

    const esClient = container.resolve<Elastic>('Elastic')
    spy = jest.spyOn(esClient['client'], 'updateByQuery')

    done()
  })

  test('index', async () => {
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'some_uid'
    await esClient.index(uid, 'my_index', { data: 'My awesome data' })
    expect(1).toBe(1)
  })

  test('search without query', async done => {
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'some_uid'
    const index = 'my_index'

    await esClient.index(uid, index, { data: 'My awesome data' })

    setTimeout(async () => {
      const response = await esClient.search(index)

      expect(response.total.value).toBe(1)
      expect(response.hits[0]).toEqual(
        expect.objectContaining({
          _index: index,
          _id: uid,
          _source: { data: 'My awesome data' },
        }),
      )
      done()
    }, 1000)
  })

  test('search with query', async done => {
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'i_am_uid'
    const index = 'i_am_index'

    await esClient.index(uid, index, { data: 'They really were here!' })

    setTimeout(async () => {
      const response = await esClient.search(index, { wildcard: { data: '*really*' } })

      expect(response.total.value).toBe(1)
      expect(response.hits[0]).toEqual(
        expect.objectContaining({
          _index: index,
          _id: uid,
          _source: { data: 'They really were here!' },
        }),
      )
      done()
    }, 1000)
  })

  test('search Not found', async () => {
    const esClient = container.resolve<Elastic>('Elastic')

    const response = await esClient.search('some')
    expect(response.hits).toEqual([])
  })

  test('delete', async done => {
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'new_one'
    const index = 'new_index'

    await esClient.index(uid, index, { data: 'This is work, though...' })

    setTimeout(async () => {
      const response = await esClient.delete(uid, index)
      expect(response).toBe(1)

      done()
    }, 1000)
  })

  test('delete Not found', async () => {
    const esClient = container.resolve<Elastic>('Elastic')

    const response = await esClient.delete('not_exist', 'not_exist')
    expect(response).toBe(0)
  })

  test('updateByQuery', async () => {
    // GIVEN Elastic client with indexed test data
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'test-uid'
    const index = 'test-index'
    const data = 'My awesome data'
    const updatedData = 'My updated data'

    await esClient.index(uid, index, { data: data })

    // NOTE wait for elastic work
    await sleep(1000)

    // WHEN update request is done
    const script = esb
      .script('source', 'ctx._source.data = params.data')
      .params({ data: updatedData })

    const builder = esb.termQuery('_id', uid)

    await esClient.updateByQuery(index, script.toJSON(), builder.toJSON())

    // THEN Elastic must contain updated values in index
    const response = await esClient.search(index, { wildcard: { data: '*updated*' } })

    expect(response.total.value).toBe(1)
    expect(response.hits[0]).toEqual(
      expect.objectContaining({
        _index: index,
        _id: uid,
        _source: { data: updatedData },
      }),
    )
  })

  test('updateByQuery failed when version conflict happens.', async () => {
    // GIVEN Elastic client with indexed test data
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'test-uid'
    const index = 'test-index'
    const data = 'My awesome data'
    const updatedData = 'My updated data'

    await esClient.index(uid, index, { data: data })

    // NOTE wait for elastic work
    await sleep(3000)

    // WHEN update request is done
    const expectedError = new ServerError(
      `Version conflict on update Elastic index "${index}".`,
      409,
      ConflictErrorCodes.UNKNOWN_CONFLICT_ERROR,
      'elastic',
    )

    spy.mockImplementationOnce(() => {
      return Promise.reject(
        new ResponseError({
          body: {},
          headers: {},
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore: we don`t need correct type for testing
          meta: {},
          statusCode: 409,
          warnings: null,
        }),
      )
    })

    const script = esb
      .script('source', 'ctx._source.data = params.data')
      .params({ data: updatedData })

    const builder = esb.termQuery('_id', uid)

    const result = await esClient.updateByQuery(index, script.toJSON(), builder.toJSON())

    // THEN Elastic must failed with status code 409
    expect(result).toEqual(expectedError)
  })

  test('updateByQuery should failed with not existed data.', async () => {
    // GIVEN Elastic client with indexed test data
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'test-uid-that-not-exist-142352352352'
    const index = 'test-index111'
    const updatedData = 'My updated data'

    const expectedError = new ServerError(
      `Elastic update "${index}" index failed`,
      404,
      404,
      'elastic',
    )

    // WHEN update request is done
    const script = esb
      .script('source', 'ctx._source.data = params.data')
      .params({ data: updatedData })

    const builder = esb.termQuery('_id', uid)
    const result = await esClient.updateByQuery(index, script.toJSON(), builder.toJSON())

    // THEN Elastic must failed with status code 404
    expect(result).toEqual(expectedError)
  })

  test('update', async done => {
    // GIVEN Elastic client with indexed test data
    const esClient = container.resolve<Elastic>('Elastic')
    const uid = 'test-uid'
    const index = 'test-index'
    const data = 'My awesome data'
    const updatedData = 'My updated data'

    await esClient.index(uid, index, { data: data })

    // NOTE wait for elastic work
    await sleep(3000)

    // WHEN update request is done
    const script = esb
      .script('source', 'ctx._source.data = params.data')
      .params({ data: updatedData })

    await esClient.update(uid, index, script.toJSON())

    // THEN Elastic must contain updated values in index
    setTimeout(async () => {
      const response = await esClient.search(index, { wildcard: { data: '*updated*' } })

      expect(response.total.value).toBe(1)
      expect(response.hits[0]).toEqual(
        expect.objectContaining({
          _index: index,
          _id: uid,
          _source: { data: updatedData },
        }),
      )
      done()
    }, 1000)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
