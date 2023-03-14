import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { IssueListFilter, IssueQueryListForValidator } from '../../../issue/model/IssueQueryList'

export class IssueListFilterConstructor
  implements ModelConstructor<IssueQueryListForValidator, IssueListFilter> {
  public constructRawForm(req: Request): IssueQueryListForValidator {
    const { offset, limit, type, resolution } = req.query

    return {
      offset: offset || 0,
      limit: limit || 10,
      type: type && type.split(','),
      resolution: resolution && resolution.split(','),
    }
  }

  public constructPureObject(req: Request): IssueListFilter {
    const { offset, limit, type, resolution } = req.query

    return {
      offset: offset || 0,
      limit: limit || 100,
      type: type && type.split(','),
      resolution: resolution && resolution.split(','),
    }
  }
}
