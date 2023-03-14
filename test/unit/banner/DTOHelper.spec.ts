import 'reflect-metadata'

import { BannerDTOHelper } from '../../../src/iviche/banner/db/BannerDTOHelper'
import { testBannersList } from '../../database/seeds/TestBannersList'
import { BannerList } from './services/BannerServiceHelper'

describe('Banners DTO Helper tests', () => {
  test('construct banner array', async () => {
    // GIVEN banners from testBannersList
    const givenBanners = testBannersList

    // WHEN construct banners array
    const construct = BannerDTOHelper.fromDBToBannerList(givenBanners)

    // THEN successful and correct construct BannerList
    expect(construct).toStrictEqual({
      // eslint-disable-next-line @typescript-eslint/camelcase
      after_polls: [BannerList[0]],
      // eslint-disable-next-line @typescript-eslint/camelcase
      after_news: [BannerList[1]],
      // eslint-disable-next-line @typescript-eslint/camelcase
      popup_center: [],
      // eslint-disable-next-line @typescript-eslint/camelcase
      popup_bottom: [],
    })
  })
})
