import axios from 'axios'

import { viberConfigIntelTele } from '../../../../config/viberConfig'
import { ApplicationError } from '../../error/ApplicationError'
import { ErrorCodes } from '../../error/ErrorCodes'
import { NotificationMessage } from '../models/NotificationMessage'
import { Notifier } from '../models/Notifier'

export class ViberNotifier implements Notifier {
  public async notify(notification: NotificationMessage): Promise<void> {
    const url = viberConfigIntelTele.url + '/im/send'
    try {
      await axios.get(url, {
        /*eslint-disable @typescript-eslint/camelcase*/
        params: {
          username: viberConfigIntelTele.username,
          api_key: viberConfigIntelTele.apiKey,
          im_sender: viberConfigIntelTele.sender,
          to: notification.receivers.join(','),
          im_message: notification.text,
        },
        /*eslint-enable */
      })
    } catch (e) {
      throw new ApplicationError(
        e.response.data.message || e.message,
        ErrorCodes.NOTIFICATION_SENDING,
      )
    }
  }
}
