import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { ConstructFrom } from '../../../generic/model/ConstructSingleFieldObject'
import { ChangeUserStatus } from '../../../profiles/models/ChangeUserStatus'

export class ChangeUserStatusModelConstructor
  implements ModelConstructor<ChangeUserStatus, ChangeUserStatus> {
  constructor(private userIdFrom: ConstructFrom) {}
  public constructRawForm(req: Request): ChangeUserStatus {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): ChangeUserStatus {
    const { userId } = req[this.userIdFrom]

    return {
      userId,
    }
  }
}
