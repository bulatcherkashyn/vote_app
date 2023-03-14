import { NotificationMessage } from '../models/NotificationMessage'
import { Notifier } from '../models/Notifier'
import { Notifiers } from '../models/Notifiers'
import { SmsNotifier } from '../notifiers/SmsNotifier'
import { ViberNotifier } from '../notifiers/ViberNotifier'
import { NotificationService } from './NotificationService'

export class NotificationServiceImpl implements NotificationService {
  private notifiers: { [key in keyof typeof Notifiers]: Notifier } = {
    [Notifiers.sms]: new SmsNotifier(),
    [Notifiers.viber]: new ViberNotifier(),
  }

  public async notify(service: Notifiers, notification: NotificationMessage): Promise<void> {
    const notifier = this.notifiers[service]
    await notifier.notify(notification)
  }
}
