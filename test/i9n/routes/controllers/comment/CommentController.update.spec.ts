import 'reflect-metadata'

import request from 'supertest'
import { container } from 'tsyringe'
import uuidv4 from 'uuid/v4'

import Knex = require('knex')
import { DateTime } from 'luxon'

import { DateUtility } from '../../../../../src/iviche/common/utils/DateUtility'
import { testNewsList } from '../../../../database/seeds/TestNewsList'
import { administratorData, regularUserData } from '../../../common/TestUtilities'
import { TestContext } from '../../../context/TestContext'

describe('Comment controller update', () => {
  const endpoint = '/news/00000000-aaaa-aaaa-aaaa-000000000002/comments'
  beforeAll(async done => {
    await TestContext.initialize()
    done()
  })

  test('Update comment successfully. As regular user', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const uid = uuidv4()
    await knex('comment').insert({
      uid,
      entityType: 'news',
      entityUID: testNewsList[1].uid,
      threadUID: uid,
      text: 'When will this convention be?',
      authorUID: regularUserData.uid,
      createdAt: DateUtility.now(),
    })

    const response = await request(TestContext.app)
      .patch(`${endpoint}/${uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: 'Where will this convention be?',
      })

    expect(response.status).toBe(200)
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid.length).toBe(36)
  })

  test('Update comment successfully. As administrator after 1 hour', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const uid = uuidv4()
    await knex('comment').insert({
      uid,
      entityType: 'news',
      entityUID: testNewsList[1].uid,
      threadUID: uid,
      text: 'No offence',
      authorUID: administratorData.uid,
      createdAt: DateTime.utc()
        .minus({ hours: 2 })
        .toISODate(),
    })

    const response = await request(TestContext.app)
      .patch(`${endpoint}/${uid}`)
      .set('Cookie', [`token=${administratorData.jwtToken}`])
      .send({
        text: 'Non taken',
      })

    expect(response.status).toBe(200)
    expect(typeof response.body.uid).toBe('string')
    expect(response.body.uid.length).toBe(36)
  })

  test('Update comment failed. Non exist uid', async () => {
    const uid = uuidv4()

    const response = await request(TestContext.app)
      .patch(`${endpoint}/${uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: 'Will it update ?',
      })

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Comment not found')
    expect(response.body.source).toBe('uid')
    expect(response.body.code).toBe(404002)
  })

  test('Update comment failed. Non uuid uid', async () => {
    const response = await request(TestContext.app)
      .patch(`${endpoint}/non-uuid`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: 'Will it update ?',
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('"uid" must be a valid GUID')
    expect(response.body.source).toBe('uid')
    expect(response.body.code).toBe(400004)
  })

  test('Update comment failed. As regular user after one hour', async () => {
    const knex = container.resolve<Knex>('DBConnection')
    const uid = uuidv4()
    await knex('comment').insert({
      uid,
      entityType: 'news',
      entityUID: testNewsList[1].uid,
      threadUID: uid,
      text: 'Its my fault',
      authorUID: regularUserData.uid,
      createdAt: DateTime.utc()
        .minus({ hours: 2 })
        .toISODate(),
    })

    const response = await request(TestContext.app)
      .patch(`${endpoint}/${uid}`)
      .set('Cookie', [`token=${regularUserData.jwtToken}`])
      .send({
        text: 'Its your fault',
      })

    expect(response.status).toBe(404)
    expect(response.body.source).toBe('comment')
    expect(response.body.code).toBe(404002)
  })

  afterAll(async done => {
    await TestContext.close()
    done()
  })
})
