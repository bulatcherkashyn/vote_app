import { Request } from 'express'

import { UserRole } from '../../common/UserRole'
import { IssueType } from '../../issue/model/IssueType'
import { PollStatus } from '../../polls/models/PollStatus'
import { User } from '../../users/models/User'
import { UserSystemStatus } from '../../users/models/UserSystemStatus'
import { ACS } from './models/ACS'
import { AccessDeniedACS, EditOwnObjectACS, GrandAccessACS } from './strategies'
import { AnonymousACS } from './strategies/AnonymousACS'
import { PollGetACS } from './strategies/PollGetACS'
import { PollUpdateACS } from './strategies/PollUpdateACS'

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-use-before-define */

export const permissions = {
  ADMINISTRATOR: {
    moderation: grandAccess,
    user_profiles: grandAccess,
    own_profile: editOwnObject,
    save_image: grandAccess,
    get_comment_thread: grandAccess,
    save_comment_thread: grandAccess,
    update_comment_thread: grandAccess,
    delete_comment_thread: grandAccess,
    save_poll: savePoll,
    get_poll: grandAccess,
    update_poll: grandAccess,
    delete_poll: updatePoll,
    hide_poll: grandAccess,
    stop_rating_monitor: grandAccess,
    create_competency_tag: grandAccess,
    update_competency_tag: grandAccess,
    delete_competency_tag: grandAccess,
    competency_tag_list: grandAccess,
    get_dashboard: grandAccess,
    get_dashboard_news: grandAccess,
    notification_list: editOwnObject,
    get_news_by_uid: grandAccess,
    update_notification: editOwnObject,
    update_tag: grandAccess,
    delete_tag: grandAccess,
    save_tag: grandAccess,
    tags_list: grandAccess,
    list_news: grandAccess,
    unlink_social_network: grandAccess,
    get_issue: grandAccess,
    update_issue: grandAccess,
    delete_poll_watch: editOwnObject,
    create_poll_watch: editOwnObject,
    list_poll_watch: editOwnObject,
  },
  MODERATOR: {
    moderation: editOwnObject,
    own_profile: editOwnObject,
    save_image: editOwnImage,
    get_comment_thread: editOwnObject,
    save_comment_thread: editOwnObject,
    update_comment_thread: editOwnObject,
    delete_comment_thread: editOwnObject,
    save_poll: savePoll,
    get_poll: getPoll,
    update_poll: updatePoll,
    delete_poll: updatePoll,
    hide_poll: grandAccess,
    competency_tag_list: grandAccess,
    get_dashboard: editOwnObject,
    get_dashboard_news: grandAccess,
    notification_list: editOwnObject,
    get_news_by_uid: grandAccess,
    update_notification: editOwnObject,
    update_tag: grandAccess,
    delete_tag: grandAccess,
    save_tag: grandAccess,
    tags_list: grandAccess,
    list_news: grandAccess,
    get_issue: grandAccess,
    update_issue: grandAccess,
    delete_poll_watch: editOwnObject,
    create_poll_watch: editOwnObject,
    list_poll_watch: editOwnObject,
  },
  JOURNALIST: {
    own_profile: editOwnObject,
    save_image: editOwnImage,
    get_comment_thread: editOwnObject,
    save_comment_thread: editOwnObject,
    update_comment_thread: editOwnObject,
    delete_comment_thread: editOwnObject,
    save_poll: savePoll,
    get_poll: getPoll,
    update_poll: updatePoll,
    delete_poll: updatePoll,
    competency_tag_list: grandAccess,
    get_dashboard: editOwnObject,
    get_dashboard_news: grandAccess,
    notification_list: editOwnObject,
    get_news_by_uid: grandAccess,
    update_notification: editOwnObject,
    tags_list: grandAccess,
    list_news: grandAccess,
    delete_poll_watch: editOwnObject,
    create_poll_watch: editOwnObject,
    list_poll_watch: editOwnObject,
  },
  PRIVATE: {
    add_own_answer: addAnswer,
    own_profile: editOwnObject,
    save_image: editOwnImage,
    get_comment_thread: editOwnObject,
    save_comment_thread: editOwnObject,
    update_comment_thread: editOwnObject,
    delete_comment_thread: editOwnObject,
    save_poll: savePoll,
    get_poll: getPoll,
    update_poll: updatePoll,
    delete_poll: updatePoll,
    competency_tag_list: grandAccess,
    get_dashboard: editOwnObject,
    get_dashboard_news: grandAccess,
    create_vote: createVote,
    notification_list: editOwnObject,
    get_news_by_uid: grandAccess,
    update_notification: editOwnObject,
    tags_list: grandAccess,
    list_news: grandAccess,
    link_social_network: editOwnObject,
    save_issue: saveIssue,
    delete_poll_watch: editOwnObject,
    create_poll_watch: editOwnObject,
    list_poll_watch: editOwnObject,
  },
  LEGAL: {
    add_own_answer: addAnswer,
    own_profile: editOwnObject,
    save_image: editOwnImage,
    get_comment_thread: editOwnObject,
    save_comment_thread: editOwnObject,
    update_comment_thread: editOwnObject,
    delete_comment_thread: editOwnObject,
    save_poll: grandAccess,
    get_poll: getPoll,
    update_poll: updatePoll,
    delete_poll: updatePoll,
    competency_tag_list: grandAccess,
    get_dashboard: editOwnObject,
    get_dashboard_news: grandAccess,
    notification_list: editOwnObject,
    get_news_by_uid: grandAccess,
    update_notification: editOwnObject,
    tags_list: grandAccess,
    list_news: grandAccess,
    link_social_network: editOwnObject,
    save_issue: saveIssue,
    delete_poll_watch: editOwnObject,
    create_poll_watch: editOwnObject,
    list_poll_watch: editOwnObject,
  },
  ANONYMOUS: {
    get_comment_thread: anonymousAccess,
    get_poll: getPoll,
    competency_tag_list: grandAccess,
    get_dashboard: anonymousAccess,
    get_dashboard_news: grandAccess,
    tags_list: grandAccess,
    get_news_by_uid: grandAccess,
    list_news: grandAccess,
    save_issue: saveIssue,
  },
  DELETED: {},
}

async function editOwnObject(req: Request): Promise<ACS> {
  const user = req.user as User

  return new EditOwnObjectACS(user.uid as string)
}

async function editOwnImage(req: Request): Promise<ACS> {
  const user = req.user as User

  if (req.query.email) {
    return new AccessDeniedACS()
  }

  return new EditOwnObjectACS(user.uid as string)
}

async function addAnswer(req: Request): Promise<ACS> {
  const user = req.user as User

  if (user.systemStatus && user.systemStatus !== UserSystemStatus.ACTIVE) {
    return new AccessDeniedACS()
  }

  return new GrandAccessACS()
}

async function savePoll(req: Request): Promise<ACS> {
  const user = req.user as User
  const draft = req.query.draft === 'true'

  if (user.systemStatus !== UserSystemStatus.ACTIVE && !draft) {
    return new AccessDeniedACS()
  }

  return new GrandAccessACS()
}

async function getPoll(req: Request): Promise<ACS> {
  const user = req.user as User

  const forbiddenStatus =
    user.role === UserRole.MODERATOR
      ? [PollStatus.DRAFT]
      : [PollStatus.DRAFT, PollStatus.REJECTED, PollStatus.MODERATION]

  return new PollGetACS(user.uid as string, forbiddenStatus)
}

async function updatePoll(req: Request): Promise<ACS> {
  const user = req.user as User

  return new PollUpdateACS(user.uid as string)
}

async function grandAccess(): Promise<ACS> {
  return new GrandAccessACS()
}

async function anonymousAccess(): Promise<ACS> {
  return new AnonymousACS()
}

async function createVote(req: Request): Promise<ACS> {
  const user = req.user as User
  const isBlitzPoll = req.query.blitz === 'true'
  const isRatingMonitorPoll = req.query.rating_monitor === 'true'
  if (!isBlitzPoll && !isRatingMonitorPoll) {
    return user.systemStatus !== UserSystemStatus.ACTIVE
      ? new AccessDeniedACS()
      : new EditOwnObjectACS(user.uid as string)
  } else {
    return user.systemStatus === UserSystemStatus.ACTIVE ||
      user.systemStatus === UserSystemStatus.LIMITED
      ? new EditOwnObjectACS(user.uid as string)
      : new AccessDeniedACS()
  }
}

async function saveIssue(req: Request): Promise<ACS> {
  const user = req.user as User
  const issueType = req.body.type

  if (
    user.role === UserRole.ANONYMOUS &&
    issueType !== IssueType.QUESTION &&
    issueType !== IssueType.PROPOSAL
  ) {
    return new AccessDeniedACS()
  }

  return new EditOwnObjectACS(user.uid as string)
}
