import { Region } from '../../../src/iviche/common/Region'
import { RegionsUtility } from '../../../src/iviche/common/utils/RegionsUtility'

describe('Region Utility', () => {
  test('Get region by city name. Successfully', async () => {
    // GIVEN city dnipro
    const city = 'Dnipro'

    // WHEN search some Region
    const region = RegionsUtility.getRegionByCity(city)

    // THEN got Dnipro
    expect(region?.key).toBe(Region.DNIPROPETROVSK_REGION)
  })
  test('Get region by city name. Fail', async () => {
    // GIVEN city test
    const city = 'test'

    // WHEN search Region
    const region = RegionsUtility.getRegionByCity(city)

    // THEN got undefined
    expect(region).toBe(undefined)
  })
})
