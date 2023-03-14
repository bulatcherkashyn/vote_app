import 'reflect-metadata'

import Knex from 'knex'
import { container } from 'tsyringe'

import { BannerDAOImpl } from '../../../src/iviche/banner/db/BannerDAOImpl'
import { Banner } from '../../../src/iviche/banner/model/Banner'
import { BannerPositions } from '../../../src/iviche/banner/model/BannerPositions'
import { WpBanner } from '../../../src/iviche/banner/model/WpBanner'
import { BannerServiceImpl } from '../../../src/iviche/banner/services/BannerServiceImpl'
import { ImageStorageDaoImpl } from '../../../src/iviche/media/image/db/ImageStorageDaoImpl'
import { Image, ImageEntity } from '../../../src/iviche/media/image/model/Image'
import { ImageStorageImpl } from '../../../src/iviche/media/image/service/ImageStorageImpl'
import { TestContext } from '../context/TestContext'

describe('Banner service', () => {
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  beforeEach(async done => {
    // Get db connection and clean db
    const knex = container.resolve<Knex>('DBConnection')
    await knex('banner').del()
    await knex('image').del()
    done()
  })

  test('Create banner', async () => {
    // GIVEN banner
    const testWpBanner: WpBanner = {
      uuid: '9c7d6295-fcd1-4289-a78f-1051519a81eb',
      title: 'Some title',
      description: null,
      showBanner: true,
      link: 'banner-link',
      position: BannerPositions.AFTER_NEWS,
      urlImageBanner: 'https://sfw.so/uploads/posts/2021-09/thumbs/1631819178_maxresdefault.jpg',
    }

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // WHEN create banner
    const bannersService = new BannerServiceImpl(
      new BannerDAOImpl(),
      knex,
      new ImageStorageImpl(new ImageStorageDaoImpl(knex)),
    )
    const receivedBannerUid = await bannersService.create(testWpBanner)

    // THEN we expect that service works fine and uid has been returned
    expect(testWpBanner.uuid).toEqual(receivedBannerUid)
  })

  test('Delete banner', async () => {
    // GIVEN test data: banner, banner image
    const testBannerImageUid = '08c6aef3-d964-4f39-9ef5-34c5dae858f0'
    const testDbBanner = {
      uid: '9c7d6295-fcd1-4289-a78f-1051519a81eb',
      title: 'Some title',
      link: 'banner-link',
      position: BannerPositions.AFTER_NEWS,
      urlImageBanner: 'http://localhost:5000/api/images/44ea85b9-2978-42e2-8ba1-56e4d07ade09',
      showBanner: true,
      imageUid: testBannerImageUid,
    }
    const testDbBannerImage = {
      uid: testBannerImageUid,
      entity: ImageEntity.banner,
      originalName: 'wpi-1631875818749',
      isPublic: true,
      data: new Uint8Array(),
      mimeType: 'image/jpeg',
      ownerUID: undefined,
    }

    // AND get db connection
    const knex = container.resolve<Knex>('DBConnection')

    // AND we add 1 banner to db
    await knex<Banner>('banner').insert(testDbBanner)
    await knex<Image>('image').insert(testDbBannerImage)

    // WHEN we delete banner
    const bannersService = new BannerServiceImpl(
      new BannerDAOImpl(),
      knex,
      new ImageStorageImpl(new ImageStorageDaoImpl(knex)),
    )
    await bannersService.delete(testDbBanner.uid)

    // THEN we expect that service works fine and uid has been deleted
    const bannersInDb = await knex('banner').select('*')
    expect(bannersInDb.length).toEqual(0)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
