import { Response } from 'supertest'

import { Comment } from '../../../../../src/iviche/comment/model/Comment'
import { Person } from '../../../../../src/iviche/person/model/Person'

export const expectCommentThread = (response: Response): void => {
  expect(response.status).toBe(200)
  expect(response.body.length).toBe(5)
  response.body.forEach((comment: Comment & Person) => {
    expect(typeof comment.uid).toBe('string')
    expect(comment.entityType).toBe('news')
    expect(typeof comment.entityUID).toBe('string')
    expect(typeof comment.text).toBe('string')
    expect(typeof comment.authorUID).toBe('string')
    expect(typeof comment.authorUID).toBe('string')
    expect(typeof comment.isLegalPerson).toBe('boolean')
    expect(comment.firstName).not.toBeUndefined()
    expect(comment.lastName).not.toBeUndefined()
    expect(comment.shortName).not.toBeUndefined()
    expect(comment.avatar).not.toBeUndefined()

    const date = new Date(`${comment.createdAt}`)
    expect(date instanceof Date && !isNaN(date.getTime())).toBe(true)
  })
}
