import 'reflect-metadata'

import { Comment } from '../../../../src/iviche/comment/model/Comment'
import { CommentEntity } from '../../../../src/iviche/comment/model/CommentEntity'
import { CommentValidator } from '../../../../src/iviche/comment/validator/CommentValidator'
import { testCommentData } from '../../../database/seeds/TestCommentData'
import { testNewsList } from '../../../database/seeds/TestNewsList'
import { regularUserData } from '../../../i9n/common/TestUtilities'

const validator = new CommentValidator()

describe('Comment validator. SUCCESS', () => {
  test('Comment validator without parentUID', () => {
    // GIVEN correct comment data
    const correctData: Comment = {
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      text: 'Please rewrite me to NEO4j',
      authorUID: regularUserData.uid,
    }

    // WHEN data will be validate
    const result = validator.validate(correctData)
    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })

  test('Comment validator with parentUID', () => {
    // GIVEN correct comment data
    const correctData: Comment = {
      entityType: CommentEntity.NEWS,
      entityUID: testNewsList[1].uid,
      text: 'Cant stand NeO4J',
      parentUID: testCommentData[0].uid,
      authorUID: regularUserData.uid,
    }

    // WHEN data will be validate
    const result = validator.validate(correctData)
    // THEN hasError in result object must be undefined
    expect(result.hasError).toBeFalsy()
  })
})
