import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { ConstructFrom } from '../../../generic/model/ConstructSingleFieldObject'
import { UpdateProfileAvatar } from '../../../profiles/models/UpdateProfileAvatar'

export class UpdateProfileAvatarAdminModelConstructor
  implements ModelConstructor<UpdateProfileAvatar, UpdateProfileAvatar> {
  constructor(private usernameFrom: ConstructFrom) {}
  public constructRawForm(req: Request): UpdateProfileAvatar {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): UpdateProfileAvatar {
    const { avatar } = req.body
    const { username } = req[this.usernameFrom]

    return {
      username,
      avatar,
    }
  }
}
