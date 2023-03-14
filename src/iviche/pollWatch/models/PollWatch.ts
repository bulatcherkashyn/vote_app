import { GenericEntity } from '../../generic/model/GenericEntity'
import { ContactType } from './ContactType'

export default interface PollWatch extends GenericEntity {
  readonly pollUID: string
  readonly pollTitle: string
  readonly userUID: string
  readonly contactType: ContactType
  readonly createdAt?: Date
}
