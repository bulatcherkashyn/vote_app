import { Request } from 'express'
import { List } from 'immutable'

import { Gender } from '../../../common/Gender'
import { ModelConstructor } from '../../../common/ModelConstructor'
import { SocialStatus } from '../../../common/SocialStatus'
import { DateUtility } from '../../../common/utils/DateUtility'
import { Poll } from '../../../polls/models/Poll'
import { PollForm } from '../../../polls/models/PollForm'

export class PollModelConstructor implements ModelConstructor<PollForm, Poll> {
  public constructPureObject(req: Request): Poll {
    const {
      theme,
      complexWorkflow,
      // anonymous,// ingnored for now (tiket iv-38)
      title,
      body,
      discussionStartAt,
      votingStartAt,
      votingEndAt,
      tags,
      competencyTags,
      taAddressRegion,
      taAddressDistrict,
      taAddressTown,
      taAgeGroups,
      taGenders,
      taSocialStatuses,
      answers,
      pollType,
      image,
    } = req.body

    const authorUID = req.user?.uid
    return {
      uid: req.params.pollId,
      theme,
      complexWorkflow: complexWorkflow || false,
      anonymous: true,
      title,
      body,
      discussionStartAt: discussionStartAt && DateUtility.fromISO(discussionStartAt),
      votingStartAt: votingStartAt && DateUtility.fromISO(votingStartAt),
      votingEndAt: votingEndAt && DateUtility.fromISO(votingEndAt),
      tags: List(tags),
      competencyTags: List(competencyTags),
      taAddressRegion,
      taAddressDistrict,
      taAddressTown,
      taAgeGroups: List(taAgeGroups),
      taGenders: List(taGenders),
      taSocialStatuses: List(taSocialStatuses),
      authorUID,
      pollType,
      answers: List(answers),
      image,
    }
  }

  public constructRawForm(req: Request): PollForm {
    const {
      theme,
      complexWorkflow,
      // anonymous,// ingnored for now (tiket iv-38)
      title,
      body,
      discussionStartAt,
      votingStartAt,
      votingEndAt,
      tags,
      competencyTags,
      taAddressRegion,
      taAddressDistrict,
      taAddressTown,
      taAgeGroups,
      taGenders,
      taSocialStatuses,
      answers,
      pollType,
      image,
    } = req.body

    const authorUID = req.user && req.user.uid

    return {
      uid: req.params.pollId,
      theme,
      complexWorkflow: complexWorkflow || false,
      anonymous: true,
      draft: req.query.draft || false, // this field just for rule validation
      title,
      body,
      discussionStartAt,
      votingStartAt,
      votingEndAt,
      tags,
      competencyTags,
      taAddressRegion,
      taAddressDistrict,
      taAddressTown,
      taAgeGroups,
      taGenders: taGenders || Gender.UNSET,
      taSocialStatuses: taSocialStatuses || SocialStatus.UNKNOWN,
      authorUID,
      answers,
      pollType,
      image,
    }
  }
}
