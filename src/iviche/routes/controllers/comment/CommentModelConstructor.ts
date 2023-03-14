import { Request } from 'express'

import { Comment } from '../../../comment/model/Comment'
import { CommentEntity } from '../../../comment/model/CommentEntity'
import { ModelConstructor } from '../../../common/ModelConstructor'

export class CommentModelConstructor implements ModelConstructor<Comment, Comment> {
  public constructRawForm(req: Request): Comment {
    const { entityType, entityUID } = req.params

    const { parentUID, text } = req.body

    const authorUID = req.user && req.user.uid
    return {
      entityType: entityType as CommentEntity,
      entityUID,
      parentUID,
      text,
      authorUID,
    }
  }

  public constructPureObject(req: Request): Comment {
    return this.constructRawForm(req)
  }
}
