import { GenericEntity } from '../../../generic/model/GenericEntity'
import { HeaderInfo } from './HeaderInfo'

export interface NotificationAuthData extends GenericEntity {
  userUid: string
  username: string
  firebaseDeviceToken: string
  headerInfo?: HeaderInfo
  createdAt?: Date
}
