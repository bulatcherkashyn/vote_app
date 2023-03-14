import { TrxProvider } from '../../db/TrxProvider'
import { GenericDAO } from '../../generic/dao/GenericDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { ACS } from '../../security/acs/models/ACS'
import { NotificationPollData } from '../models/NotificationPollData'
import { Poll } from '../models/Poll'
import { PollAnswer } from '../models/PollAnswer'
import { PollStatus } from '../models/PollStatus'

export interface PollDAO extends GenericDAO<Poll> {
  addSingleAnswer(trxProvider: TrxProvider, answer: PollAnswer, acs: ACS): Promise<string>

  get(
    trxProvider: TrxProvider,
    uid: string,
    acs: ACS,
  ): Promise<ObjectWithAuthorDataObject<Poll> | undefined>

  getPollByStatuses(
    trxProvider: TrxProvider,
    pollStatuses: Array<PollStatus>,
  ): Promise<Array<Record<string, string>>>
  getSinglePollAnswer(trxProvider: TrxProvider, uid: string): Promise<PollAnswer | undefined>

  updateSingleAnswer(trxProvider: TrxProvider, pollAnswer: Partial<PollAnswer>): Promise<void>

  findAnswerForUser(
    trxProvider: TrxProvider,
    pollUID: string,
    authorUID: string,
  ): Promise<PollAnswer | undefined>

  partialUpdate(trxProvider: TrxProvider, uid: string, poll: Partial<Poll>, acs: ACS): Promise<void>

  list(
    trxProvider: TrxProvider,
    params: EntityFilter,
    acs: ACS,
    UIDs?: Array<string>,
  ): Promise<PagedList<Poll>>

  getUserPollCount(trxProvider: TrxProvider, userUID: string): Promise<number>

  hidePoll(trxProvider: TrxProvider, uid: string): Promise<void>

  getPollsForNotification(
    trxProvider: TrxProvider,
    UIDs: Array<string>,
  ): Promise<Array<NotificationPollData>>
}
