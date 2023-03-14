import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { Issue } from '../../../issue/model/Issue'
import { IssueResolution } from '../../../issue/model/IssueResolution'

export class IssueModelConstructor implements ModelConstructor<Issue, Issue> {
  public constructPureObject(req: Request): Issue {
    return this.constructRawForm(req)
  }
  public constructRawForm(req: Request): Issue {
    const { type, body, reference, referenceObjectType } = req.body
    const { issuerEmail } = req.query

    return {
      type,
      body,
      reference,
      referenceObjectType,
      userUID: req.user?.uid,
      issuerEmail,
      resolution: IssueResolution.PENDING,
    }
  }
}
