import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { ContactType } from '../../../pollWatch/models/ContactType'
import PollWatch from '../../../pollWatch/models/PollWatch'
import { PollWatchBody } from '../../../pollWatch/models/PollWatchBody'

export class PollWatchModelConstructor implements ModelConstructor<PollWatchBody, PollWatch> {
  public constructRawForm(req: Request): PollWatchBody {
    const { pollUID } = req.body
    return {
      pollUID,
    }
  }

  public constructPureObject(req: Request): PollWatch {
    const { pollUID } = req.body

    const userUID = req.user && req.user.uid
    return {
      pollUID,
      pollTitle: '',
      userUID,
      contactType: ContactType.MANUAL,
    }
  }

  public constructPureObjectWithUID(req: Request, pollUID: string): PollWatch {
    const userUID = req.user && req.user.uid
    return {
      pollUID,
      pollTitle: '',
      userUID,
      contactType: ContactType.MANUAL,
    }
  }
}
