import 'reflect-metadata'

import request from 'supertest'

import { seed } from '../../../../database/seeds/TestPersonsList'
import { administratorData, primeAdminData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('ImageController successful', () => {
  beforeAll(async done => {
    await TestContext.initialize([seed])
    done()
  })

  test('SAVE private image successfully', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save private image
    const response = await request(TestContext.app)
      .post('/images')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be successful and contains image uid
    expect(response.status).toBe(200)
    expect(response.body.uid.length).toBe(36)
  })

  test('SAVE public image successfully', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save public image
    const response = await request(TestContext.app)
      .post('/images?public=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be successful and contains image uid
    expect(response.status).toBe(200)
    expect(response.body.uid.length).toBe(36)
  })

  test('SAVE private image for another person successfully', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save private image
    const response = await request(TestContext.app)
      .post(`/images?email=${regularUserData.username}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be successful and contains image uid
    expect(response.status).toBe(200)
    expect(response.body.uid.length).toBe(36)
  })

  test('SAVE public image for another person successfully', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save public image
    const response = await request(TestContext.app)
      .post(`/images?email=${regularUserData.username}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be successful and contains image uid
    expect(response.status).toBe(200)
    expect(response.body.uid.length).toBe(36)
  })

  test('GET public image successfully', async () => {
    // GIVEN public image in database
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    const imageResponse = await request(TestContext.app)
      .post('/images?public=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // WHEN get this image with random token
    const response = await request(TestContext.app).get(`/images/${imageResponse.body.uid}`)
    // THEN response must be successful and contains image buffer
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Buffer)
  })

  // NOTE: rewrite it when image token will be implemented
  test('GET private image successfully', async () => {
    // GIVEN private image in database
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    const imageResponse = await request(TestContext.app)
      .post('/images?public=false')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // AND assets token
    // WHEN get this image with my access token
    const response = await request(TestContext.app)
      .get(`/images/${imageResponse.body.uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
    // THEN response must be successful and contains image buffer
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Buffer)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
