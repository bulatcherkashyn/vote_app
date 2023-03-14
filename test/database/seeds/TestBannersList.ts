import * as Knex from 'knex'

import { BannerPositions } from '../../../src/iviche/banner/model/BannerPositions'
import { DbBanner } from '../../../src/iviche/banner/model/DbBanner'

export const testBannersList: Array<DbBanner> = [
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000001',
    title: 'title 1',
    link: 'http:\\/\\/iviche.loc\\/',
    position: BannerPositions.AFTER_POLLS,
    description: null,
    urlImageBanner:
      'http:\\/\\/wp.iviche.com\\/wp-content\\/uploads\\/2021\\/02\\/depositphotos_31682477_xl-2015-kopyja.jpg',
    showBanner: true,
    imageUid: '53d8882f-aa18-440e-ab37-12514248edd3',
  },
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    link: 'http:\\/\\/sfw.so\\/',
    position: BannerPositions.AFTER_NEWS,
    description: null,
    urlImageBanner:
      'http:\\/\\/wp.iviche.com\\/wp-content\\/uploads\\/2021\\/02\\/depositphotos_31682477_xl-2015-kopyja.jpg',
    showBanner: true,
    imageUid: 'b1c9f8d7-cf08-443e-953c-0573e7cc1684',
  },
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000003',
    title: 'title 3',
    link: 'http:\\/\\/google.com\\/',
    position: BannerPositions.AFTER_POLLS,
    description: null,
    urlImageBanner:
      'http:\\/\\/wp.iviche.com\\/wp-content\\/uploads\\/2021\\/02\\/depositphotos_31682477_xl-2015-kopyja.jpg',
    showBanner: false,
    imageUid: '53d8882f-aa18-440e-ab37-12514248edd3',
  },
]

export async function bannersSeed(knex: Knex): Promise<void> {
  const formatForDb = testBannersList.map(({ uuid, ...rest }) => {
    return { uid: uuid, ...rest }
  })
  await knex('banner').insert(formatForDb)
}
