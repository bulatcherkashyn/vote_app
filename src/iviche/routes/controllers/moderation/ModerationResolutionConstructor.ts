import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { ModerationResolve } from '../../../moderation/model/ModerationResolve'

export class ModerationResolutionConstructor
  implements ModelConstructor<ModerationResolve, ModerationResolve> {
  public constructPureObject(req: Request): ModerationResolve {
    return this.constructRawForm(req)
  }

  public constructRawForm(req: Request): ModerationResolve {
    const { resolution, concern } = req.body

    return {
      uid: req.params.uid,
      resolution,
      concern,
      moderatorUID: req.user ? req.user.uid : 'undefined',
      lockingCounter: req.body.lockingCounter,
    }
  }
}
