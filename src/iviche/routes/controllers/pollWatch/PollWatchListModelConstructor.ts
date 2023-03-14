import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { EntityFilter } from '../../../generic/model/EntityFilter'

export class PollWatchListModelConstructor implements ModelConstructor<EntityFilter, EntityFilter> {
  public constructRawForm(req: Request): EntityFilter {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): EntityFilter {
    const { offset, limit } = req.query
    return {
      offset: offset || 0,
      limit: limit || 100,
    }
  }
}
