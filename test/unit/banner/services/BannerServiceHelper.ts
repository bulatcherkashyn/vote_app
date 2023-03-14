import { Banner } from '../../../../src/iviche/banner/model/Banner'

const BannerData = {
  description: null,
  urlImageBanner:
    'http:\\/\\/wp.iviche.com\\/wp-content\\/uploads\\/2021\\/02\\/depositphotos_31682477_xl-2015-kopyja.jpg',
}

export const BannerList: Array<Banner> = [
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000001',
    title: 'title 1',
    link: 'http:\\/\\/iviche.loc\\/',
    ...BannerData,
  },
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000002',
    title: 'title 2',
    link: 'http:\\/\\/sfw.so\\/',
    ...BannerData,
  },
  {
    uuid: '00000000-baaa-bbbb-cccc-000000000003',
    title: 'title 3',
    link: 'http:\\/\\/google.com\\/',
    ...BannerData,
  },
]
