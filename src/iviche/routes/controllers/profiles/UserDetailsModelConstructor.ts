import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { UserDetails } from '../../../users/models/UserDetails'

export class UserDetailsModelConstructor implements ModelConstructor<UserDetails, UserDetails> {
  public constructRawForm(req: Request): UserDetails {
    return this.constructPureObject(req)
  }

  public constructPureObject(req: Request): UserDetails {
    const {
      enableEmailNotification,
      notifySMS,
      notifyTelegram,
      notifyViber,
      notifyAboutNewPoll,
      linkFacebook,
      linkGoogle,
      linkSite,
      language,
    } = req.body

    return {
      notifyEmail: enableEmailNotification ?? true,
      notifySMS,
      notifyTelegram,
      notifyViber,
      notifyAboutNewPoll,
      linkFacebook,
      linkGoogle,
      linkSite,
      language,
    }
  }
}
