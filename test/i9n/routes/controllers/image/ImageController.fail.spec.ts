import 'reflect-metadata'

import request from 'supertest'

import { ValidationErrorCodes } from '../../../../../src/iviche/error/DetailErrorCodes'
import { seed } from '../../../../database/seeds/TestPersonsList'
import { administratorData, primeAdminData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('ImageController fail', () => {
  beforeAll(async done => {
    await TestContext.initialize([seed])
    done()
  })

  test('SAVE image fail. Without authorization token', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save private image without token
    const response = await request(TestContext.app)
      .post('/images')
      .attach('image', imageUrl)
    // THEN response must be failed with code 401
    expect(response.status).toBe(401)
  })

  test('SAVE image fail. With not boolean public', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save image with not boolean public
    const response = await request(TestContext.app)
      .post('/images?public=truee')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be failed with code 400
    expect(response.status).toBe(400)
    expect(response.body).toStrictEqual({
      message: '"public" must be a boolean',
      source: 'public',
      code: ValidationErrorCodes.FIELD_DATA_TYPE_VALIDATION_ERROR,
    })
  })

  test('SAVE image fail. With bad file type', async () => {
    // GIVEN txt for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/text.png'
    // WHEN save image with bad file type
    const response = await request(TestContext.app)
      .post('/images?public=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be failed with code 400
    expect(response.status).toBe(400)
    expect(response.body.message).toEqual('Forbidden image type')
  })

  test('SAVE image fail. With large file size', async () => {
    // GIVEN large file for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/large.jpg'
    // WHEN save image with bad file type
    const response = await request(TestContext.app)
      .post('/images?public=true')
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be failed with code 400
    expect(response.status).toBe(400)
    expect(response.body.message).toEqual('File size has been exceeded')
  }, 90000)

  test('GET image fail. With invalid uid', async () => {
    // GIVEN invalid uid
    const uid = '2dec8472-87b5-4e4d-a007-909c7fbecb7a'
    // WHEN get image with non exist uid
    const response = await request(TestContext.app)
      .get(`/images/${uid}`)
      .set('Cookie', [`token=${primeAdminData.jwtToken}`])
    // THEN response must be failed with code 404
    expect(response.status).toBe(404)
    expect(response.body.message).toEqual('Not found')
  })

  test('SAVE_AS fail. Wrong role', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save private image
    const response = await request(TestContext.app)
      .post(`/images?email=${regularUserData.username}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response must be fail
    expect(response.status).toBe(403)
    expect(response.body.message).toBe('Access denied')
  })

  test('SAVE_AS fail. User not found', async () => {
    // GIVEN image for uploading
    const imageUrl = './test/i9n/routes/controllers/image/files/success_ava.jpeg'
    // WHEN save public image
    const response = await request(TestContext.app)
      .post('/images?email=blabla@bla.bla')
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .attach('image', imageUrl)
    // THEN response fail
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('User not found')
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
