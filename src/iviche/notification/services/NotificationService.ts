import { NotificationMessage } from '../models/NotificationMessage'
import { Notifiers } from '../models/Notifiers'

export interface NotificationService {
  notify(service: Notifiers, notification: NotificationMessage): Promise<void>
}
