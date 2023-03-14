import { Region } from '../Region'
import { City, RegionsAndDistricts, regionsAndDistricts } from '../RegionsNDistricts'

export class RegionsUtility {
  public static findRegionObject(region: Region): RegionsAndDistricts | undefined {
    return regionsAndDistricts.find(
      (element: RegionsAndDistricts): boolean => element.key === region,
    )
  }

  public static getCenterOf(region: Region, town: string): string | undefined {
    const regionObject = RegionsUtility.findRegionObject(region)
    const townObject = regionObject?.cities.find((element: City): boolean => element.key === town)
    return townObject?.centerOf
  }

  public static getRegionByCity(cityName: string): RegionsAndDistricts | undefined {
    return regionsAndDistricts.find(region =>
      region.cities.find(city => city.title.EN === cityName),
    )
  }
}
