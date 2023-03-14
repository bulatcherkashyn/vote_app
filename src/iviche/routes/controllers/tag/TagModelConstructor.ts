import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { Tag } from '../../../tag/model/Tag'

export class TagModelConstructor implements ModelConstructor<Tag, Tag> {
  public constructRawForm(req: Request): Tag {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): Tag {
    const { value } = req.body
    const { uid } = req.params

    return {
      value,
      uid,
    }
  }
}
