import 'reflect-metadata'

import request from 'supertest'

import { BannerDTOHelper } from '../../../../../src/iviche/banner/db/BannerDTOHelper'
import { BannerList } from '../../../../../src/iviche/banner/model/BannerList'
import { bannersSeed, testBannersList } from '../../../../database/seeds/TestBannersList'
import { TestContext } from '../../../context/TestContext'

describe('BannersController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([bannersSeed])

    done()
  })

  test('GET to /banners successfully', async () => {
    // WHEN request is done to /banners address
    const response = await request(TestContext.app).get('/banners')

    // THEN response must be successful
    expect(response.status).toBe(200)

    // AND result must contain banners from testBannersList in BannerList format
    const expectedBannerList: BannerList = BannerDTOHelper.fromDBToBannerList(testBannersList)
    expect(response.body).toStrictEqual(expectedBannerList)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
