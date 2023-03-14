import { GenericEntity } from '../../generic/model/GenericEntity'
import { NotificationType } from './NotificationType'

export interface Notification extends GenericEntity {
  message: string
  type: NotificationType
  referenceUid?: string
  targetUserUid: string
  createdAt?: Date
  isRead?: boolean
}
