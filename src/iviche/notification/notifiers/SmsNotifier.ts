import axios from 'axios'

import { smsConfigIntelTele } from '../../../../config/smsConfig'
import { ApplicationError } from '../../error/ApplicationError'
import { ErrorCodes } from '../../error/ErrorCodes'
import { NotificationMessage } from '../models/NotificationMessage'
import { Notifier } from '../models/Notifier'

export class SmsNotifier implements Notifier {
  public async notify(notification: NotificationMessage): Promise<void> {
    const url = smsConfigIntelTele.url + '/message/send'
    try {
      await axios.get(url, {
        params: {
          username: smsConfigIntelTele.username,
          // eslint-disable-next-line @typescript-eslint/camelcase
          api_key: smsConfigIntelTele.apiKey,
          from: smsConfigIntelTele.from,
          to: notification.receivers.join(','),
          message: notification.text,
        },
      })
    } catch (e) {
      throw new ApplicationError(
        e.response.data.message || e.message,
        ErrorCodes.NOTIFICATION_SENDING,
      )
    }
  }
}
