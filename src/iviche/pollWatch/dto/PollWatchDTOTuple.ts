import { ContactType } from '../models/ContactType'

export interface PollWatchDTOTuple {
  readonly uid: string
  readonly pollUID: string
  readonly pollTitle: string
  readonly userUID: string
  readonly contactType: ContactType
  readonly createdAt: Date
}
