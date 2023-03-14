import { GenericService } from '../../generic/service/GenericService'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { RatingMonitor } from '../../ratingMonitor/models/RatingMonitor'
import { ACS } from '../../security/acs/models/ACS'
import { NotificationPollData } from '../models/NotificationPollData'
import { Poll } from '../models/Poll'
import { PollAnswer } from '../models/PollAnswer'
import { PollAnswerForm } from '../models/PollAnswerForm'
import { PollStatus } from '../models/PollStatus'

export interface PollService extends GenericService<Poll> {
  savePollAnswer(answer: PollAnswerForm, acs: ACS): Promise<string>

  savePoll(poll: Poll, saveAsDraft: boolean, acs: ACS): Promise<string>

  get(uid: string, acs: ACS): Promise<ObjectWithAuthorDataObject<Poll> | undefined>

  getPollByStatuses(pollStatuses: Array<PollStatus>): Promise<Array<Record<string, string>>>

  partialUpdate(uid: string, poll: Partial<Poll>, acs: ACS): Promise<void>

  getPollAnswerInfo(pollUID: string, userUID: string): Promise<PollAnswer | undefined>

  getUserPollCount(userUID: string): Promise<number>

  hidePoll(uid: string): Promise<void>

  getPollsForNotification(UIDs: Array<string>): Promise<Array<NotificationPollData>>

  index(uid: string, poll: Poll | RatingMonitor): Promise<void>
}
