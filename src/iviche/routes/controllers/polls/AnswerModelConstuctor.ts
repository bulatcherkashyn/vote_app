import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { PollAnswer } from '../../../polls/models/PollAnswer'
import { PollAnswerForm } from '../../../polls/models/PollAnswerForm'

export class AnswerModelConstructor implements ModelConstructor<PollAnswerForm, PollAnswer> {
  public constructPureObject(req: Request): PollAnswer {
    const { title, index, basic } = req.body
    const authorUID = req.user && req.user.uid

    return {
      uid: req.params.answerId,
      title,
      basic: basic || false,
      index: index || 1000000,
      authorUID,
      pollUID: req.params.pollId,
    }
  }

  public constructRawForm(req: Request): PollAnswerForm {
    const { title, basic, index } = req.body

    return {
      uid: req.params.answerId,
      title,
      basic: basic || false,
      index: index || 1000000,
    }
  }
}
