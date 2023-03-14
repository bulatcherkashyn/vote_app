import 'reflect-metadata'

import { LocationService } from '../../../src/iviche/location/service/LocationService'
import SpyInstance = jest.SpyInstance

const locationService = new LocationService()

describe('LocationService', () => {
  let spy: SpyInstance

  beforeAll(async done => {
    spy = jest.spyOn(locationService['ipService'], 'city')
    done()
  })
  test.skip('getRegionByIp. Successfully', async () => {
    const testIp = '0.0.0.0'

    const cityObjectByIp = {
      city: {
        names: {
          en: 'Kharkiv',
        },
      },
    }
    spy.mockImplementationOnce(() => {
      return Promise.resolve(cityObjectByIp)
    })

    const result = await locationService.getRegionByIp(testIp)

    expect(spy).toHaveBeenCalledWith(testIp)
    expect(result).toEqual('KHARKIV_REGION')
  })

  test.skip('getRegionByIp. Unknown city name', async () => {
    const testIp = '0.0.0.0'

    const cityObjectByIp = {
      city: {
        names: {
          en: 'UnknownCityTest',
        },
      },
    }
    spy.mockImplementationOnce(() => {
      return Promise.resolve(cityObjectByIp)
    })

    const result = await locationService.getRegionByIp(testIp)

    expect(spy).toHaveBeenCalledWith(testIp)
    expect(result).toEqual('KYIV_REGION')
  })

  test.skip('getRegionByIp. Error in ipService', async () => {
    const testIp = '0.0.0.0'

    const cityObjectByIp = new Error('test error')
    spy.mockImplementationOnce(() => {
      return Promise.resolve(cityObjectByIp)
    })

    const result = await locationService.getRegionByIp(testIp)

    expect(spy).toHaveBeenCalledWith(testIp)
    expect(result).toEqual('KYIV_REGION')
  })
})
