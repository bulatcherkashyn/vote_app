import { ModerationInfoOfRejectedEntity } from '../../moderation/model/ModerationInfoOfRejectedPoll'
import { Notification } from '../../notificationStorage/models/Notification'
import { Profile } from './Profile'

export interface MyProfileGetDTO extends Profile {
  unreadNotificationsCount?: number
  myPollsCount?: number
  lastNotifications?: Array<Notification>
  moderationInfo?: ModerationInfoOfRejectedEntity
}
