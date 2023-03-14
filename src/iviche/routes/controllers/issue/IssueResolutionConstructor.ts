import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { IssueResolve } from '../../../issue/model/IssueResolve'

export class IssueResolutionConstructor implements ModelConstructor<IssueResolve, IssueResolve> {
  public constructPureObject(req: Request): IssueResolve {
    return this.constructRawForm(req)
  }

  public constructRawForm(req: Request): IssueResolve {
    const { resolution, comment } = req.body

    return {
      uid: req.params.uid,
      resolution,
      comment,
      moderatorUID: req.user ? req.user.uid : 'undefined',
    }
  }
}
