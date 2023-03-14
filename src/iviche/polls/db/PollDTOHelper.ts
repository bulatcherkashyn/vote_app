import { List } from 'immutable'

import { logger } from '../../logger/LoggerFactory'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { MutablePollDTO } from '../dto/MutablePollDTO'
import { PollDTOTuple } from '../dto/PollDTOTuple'
import { Poll } from '../models/Poll'
import { PollAnswer } from '../models/PollAnswer'
import { PollAnswerStatus } from '../models/PollAnswerStatus'

export class PollDTOHelper {
  public static constructPollArrayFromTuplesArray(
    pollTuples: Array<PollDTOTuple>,
  ): Array<ObjectWithAuthorDataObject<Poll>> {
    logger.debug('poll.dto-helper.convert-list-tuples-to-poll.start')
    const mutablePollMap: Map<string, MutablePollDTO> = new Map()

    pollTuples.forEach(tuple => {
      if (tuple.uid) {
        let pollDto = mutablePollMap.get(tuple.uid)
        if (!pollDto) {
          pollDto = this.constructMutablePollFromTuple(tuple)
          mutablePollMap.set(tuple.uid, pollDto)
        }

        if (tuple.answerUid && tuple.answerStatus === PollAnswerStatus.PUBLISHED) {
          pollDto.answers.push(this.constructPollAnswerFromTuple(tuple))
        }
      }
    })
    const res: Array<Poll> = Array.from(mutablePollMap.values()).map(e =>
      this.constructPollFromMutableDTO(e),
    )

    logger.debug('poll.dto-helper.convert-list-tuples-to-poll.done')
    return res
  }

  private static constructMutablePollFromTuple(tuple: PollDTOTuple): MutablePollDTO {
    return {
      uid: tuple.uid,
      theme: tuple.theme,
      complexWorkflow: tuple.complexWorkflow,
      anonymous: tuple.anonymous,
      status: tuple.status,
      title: tuple.title,
      body: tuple.body,
      createdAt: tuple.createdAt,
      publishedAt: tuple.publishedAt,
      discussionStartAt: tuple.discussionStartAt,
      votingStartAt: tuple.votingStartAt,
      votingEndAt: tuple.votingEndAt,
      tags: tuple.tags,
      competencyTags: tuple.competencyTags,
      taAgeGroups: tuple.taAgeGroups,
      taGenders: tuple.taGenders,
      taSocialStatuses: tuple.taSocialStatuses,
      taAddressDistrict: tuple.taAddressDistrict,
      taAddressRegion: tuple.taAddressRegion,
      taAddressTown: tuple.taAddressTown,
      authorUID: tuple.authorUID,
      answersCount: tuple.answersCount,
      votesCount: tuple.votesCount,
      commentsCount: tuple.commentsCount,
      isHidden: tuple.isHidden,
      pollType: tuple.pollType,
      authorData: {
        isLegalPerson: tuple.authorIsLegalPerson,
        firstName: tuple.authorFirstName,
        lastName: tuple.authorLastName,
        shortName: tuple.authorShortName,
        avatar: tuple.authorAvatar,
        email: tuple.authorEmail,
      },
      // NOTE: as we use frozen PollAnswer already, we will reuse it
      answers: Array<PollAnswer>(),
      image: tuple.image,
    }
  }

  private static constructPollFromMutableDTO(
    dto: MutablePollDTO,
  ): ObjectWithAuthorDataObject<Poll> {
    return Object.freeze({
      ...dto,
      tags: List(dto.tags),
      competencyTags: List(dto.competencyTags),
      taAgeGroups: List(dto.taAgeGroups),
      taGenders: List(dto.taGenders),
      taSocialStatuses: List(dto.taSocialStatuses),
      answers: List(dto.answers),
    })
  }

  private static constructPollAnswerFromTuple(pollTuple: PollDTOTuple): PollAnswer {
    return Object.freeze({
      pollUID: pollTuple.uid,
      uid: pollTuple.answerUid,
      basic: pollTuple.answerBasic,
      status: pollTuple.answerStatus,
      title: pollTuple.answerTitle,
      createdAt: pollTuple.answerCreatedAt,
      authorUID: pollTuple.answerAuthorUID,
      index: pollTuple.answerIndex,
    })
  }
}
