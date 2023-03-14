import { createRequest } from 'node-mocks-http'

import { FilterModelConstructor } from '../../../src/iviche/routes/controllers/FilterModelConstructor'

const filterConstructor: FilterModelConstructor = new FilterModelConstructor()

describe('Testing FilterModelConstructor', () => {
  test('Check constructor with eEmpty filter and sort', async () => {
    // GIVEN new request data
    const data = createRequest({
      method: 'GET',
      url: '/user',
      query: {},
    })
    // AND expected metadata
    const metadata = { limit: 100, offset: 0 }
    // WHEN construct new model
    const meta = filterConstructor.constructPureObject(data)

    // THEN pagination metadata equal meta
    expect(meta).toStrictEqual(metadata)
  })

  test('Check constructor with filter', async () => {
    // GIVEN new request data
    const data = createRequest({
      method: 'GET',
      url: '/user?limit=2&offset=1',
      query: { limit: '2', offset: '1' },
    })

    // AND expected metadata
    const metadata = { limit: 2, offset: 1 }

    // WHEN construct new model
    const meta = filterConstructor.constructPureObject(data)

    // THEN pagination metadata equal meta
    expect(meta).toStrictEqual(metadata)
  })

  test('Check constructor with sort asc', async () => {
    // GIVEN new request data
    const data = createRequest({
      method: 'GET',
      url: '/user?orderBy=bla',
      query: { orderBy: 'bla' },
    })

    // AND expected metadata
    const metadata = { limit: 100, offset: 0, order: { asc: true, orderBy: 'bla' } }

    // WHEN construct new model
    const meta = filterConstructor.constructPureObject(data)

    // THEN pagination metadata equal meta
    expect(meta).toStrictEqual(metadata)
  })

  test('Check constructor with sort desc', async () => {
    // GIVEN new request data
    const data = createRequest({
      method: 'GET',
      url: '/user?orderBy=bla&asc=false',
      query: { orderBy: 'bla', asc: 'false' },
    })

    // AND expected metadata
    const metadata = { limit: 100, offset: 0, order: { asc: false, orderBy: 'bla' } }

    // WHEN construct new model
    const meta = filterConstructor.constructPureObject(data)

    // THEN pagination metadata equal meta
    expect(meta).toStrictEqual(metadata)
  })

  test('Check constructor with sort and filter', async () => {
    // GIVEN new request data
    const data = createRequest({
      method: 'GET',
      url: '/user?orderBy=bla&asc=false&limit=2&offset=1',
      query: { orderBy: 'bla', asc: false, limit: 2, offset: 1 },
    })

    // AND expected metadata
    const metadata = { limit: 2, offset: 1, order: { asc: true, orderBy: 'bla' } }

    // WHEN construct new model
    const meta = filterConstructor.constructPureObject(data)

    // THEN pagination metadata equal meta
    expect(meta).toStrictEqual(metadata)
  })
})
