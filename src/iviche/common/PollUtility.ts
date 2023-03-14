import { AgeGroup } from '../polls/models/AgeGroup'
import { Poll } from '../polls/models/Poll'
import { PollIndex } from '../polls/models/PollIndex'
import { PollStatus } from '../polls/models/PollStatus'
import { RatingMonitor } from '../ratingMonitor/models/RatingMonitor'

export enum AllowedPollStatusesForSave {
  DRAFT = PollStatus.DRAFT,
  REJECTED = PollStatus.REJECTED,
}
export class PollUtility {
  public static verifyAllowedPollStatusForSave(poll: Poll | RatingMonitor): boolean {
    return Object.values(AllowedPollStatusesForSave).includes(poll.status as string)
  }

  static toPollIndex(poll: Poll | RatingMonitor): PollIndex {
    return {
      uid: poll.uid as string,
      body: poll.body,
      theme: poll.theme,
      title: poll.title,
      tags: poll.tags?.join(' '),
      pollType: poll.pollType,
      status: poll.status,
      authorUID: poll.authorUID.split('-', 5).join(''),
      competencyTags: poll.competencyTags?.join(' '),
      publishedAt: poll.publishedAt?.toISOString(),
      taAddressRegion: poll.taAddressRegion,
      taAddressDistrict: poll.taAddressDistrict,
    }
  }

  static getAgeGroup(age: number): AgeGroup {
    if (age < 20) {
      return AgeGroup.TWENTY
    }
    if (age < 25) {
      return AgeGroup.TWENTY_FIVE
    }
    if (age < 35) {
      return AgeGroup.THIRTY_FIVE
    }
    if (age < 45) {
      return AgeGroup.FORTY_FIVE
    }
    if (age < 55) {
      return AgeGroup.FIFTY_FIVE
    }

    return AgeGroup.FIFTY_SIX_PLUS
  }
}
