import { NotificationMessage } from './NotificationMessage'

export interface Notifier {
  notify: (notification: NotificationMessage) => Promise<void>
}
