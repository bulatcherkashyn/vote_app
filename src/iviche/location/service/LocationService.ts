import { WebServiceClient } from '@maxmind/geoip2-node'

import { Region } from '../../common/Region'
// import { RegionsUtility } from '../../common/utils/RegionsUtility'
// import { logger } from '../../logger/LoggerFactory'

export class LocationService {
  // if keys for test dont work -> create new form maxmind geoip2
  // eslint-disable-next-line
  private ipService = new WebServiceClient(
    process.env.IP_SERVICE_KEY || 'add_ip_service_key',
    process.env.IP_SERVICE_LICENSE || 'add_ip_service_license',
  )

  // TODO Uncomment this when we need this functionality
  // eslint-disable-next-line
  public async getRegionByIp(ip: string): Promise<Region> {
    // logger.debug('location.service.get-region-by-ip.start')
    // try {
    //   const location = await this.ipService.city(ip)
    //   const city = location.city as CityRecord

    //   const region = RegionsUtility.getRegionByCity(city.names.en)

    //   logger.debug('location.service.get-region-by-ip.done')
    //   if (region) {
    //     return region.key as Region
    //   }
    //   return Region.KYIV_REGION
    // } catch (err) {
    //   logger.error('location.service.get-region-by-ip.error', err)
    //   return Region.KYIV_REGION
    // }

    // TODO remove this return when we need this functionality above
    return Region.KYIV_REGION
  }
}
