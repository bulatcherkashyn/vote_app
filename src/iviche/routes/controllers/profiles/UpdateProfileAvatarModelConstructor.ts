import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { Avatar } from '../../../person/model/Avatar'

export class UpdateProfileAvatarModelConstructor implements ModelConstructor<Avatar, Avatar> {
  public constructRawForm(req: Request): Avatar {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): Avatar {
    const { avatar } = req.body

    return {
      avatar,
    }
  }
}
