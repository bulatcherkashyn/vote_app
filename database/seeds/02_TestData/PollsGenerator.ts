import crypto from 'crypto'
import { List } from 'immutable'
import uuidv4 from 'uuid/v4'

import { Gender } from '../../../src/iviche/common/Gender'
import { Language } from '../../../src/iviche/common/Language'
import { Region } from '../../../src/iviche/common/Region'
import { RegionsAndDistricts } from '../../../src/iviche/common/RegionsNDistricts'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Theme } from '../../../src/iviche/common/Theme'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { RegionsUtility } from '../../../src/iviche/common/utils/RegionsUtility'
import { AgeGroup } from '../../../src/iviche/polls/models/AgeGroup'
import { Poll } from '../../../src/iviche/polls/models/Poll'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { PollAnswerStatus } from '../../../src/iviche/polls/models/PollAnswerStatus'
import { PollStatus } from '../../../src/iviche/polls/models/PollStatus'
import { PollType } from '../../../src/iviche/polls/models/PollType'
import { StatisticServiceImpl } from '../../../src/iviche/statistics/service/StatisticServiceImpl'
import { User } from '../../../src/iviche/users/models/User'
import { Vote } from '../../../src/iviche/voting/model/Vote'
import { VotingResult } from '../../../src/iviche/voting/model/VotingResult'
import { VotingRound } from '../../../src/iviche/voting/model/VotingRound'
import { VotingRoundType } from '../../../src/iviche/voting/model/VotingRoundType'
import { ArticleTitleDefinition } from './ArticleTitleDefinition'
import { Counter, generateDate } from './common'
import { publicUsers } from './data/AdditionalUsers'
import { generateBodyText } from './data/DummyTextData'
import { globalLastnameThemes } from './data/NewsData'
import { readyAnswers } from './data/PollsData'
import { generateTags } from './TagsGenerator'

const BASIC_VOTES_NUMBER = 500
const VOTES_MULTIPLIER = parseInt(process.env.TEST_DATA_GENERATOR_VOTES_MULTIPLIER as string) || 10

const counter = new Counter()

const StatisticService = new StatisticServiceImpl()

const PollsThemes = Object.values(Theme)
const PollsTAAges = Object.values(AgeGroup)
const PollsSocialStatuses = Object.values(SocialStatus)

const generateTAAgeGroups4Poll = (pollNumber: number): List<AgeGroup> => {
  if (pollNumber % 11 === 0) {
    // only each eleventh poll will get AgeGroups
    const start = pollNumber % 5
    const length = pollNumber % 9
    return List(PollsTAAges.slice(start, start + length))
  }
  return List<AgeGroup>()
}

const generateTASocialStatuses4Poll = (pollNumber: number): List<SocialStatus> => {
  if (pollNumber % 7 === 0) {
    // only each seventh poll will get SocialStatuses
    const start = pollNumber % 5
    const length = pollNumber % 9
    return List(PollsSocialStatuses.slice(start, start + length))
  }
  return List<SocialStatus>()
}

const generateAnswers4Poll = (
  lang: Language,
  lastnameAnswers: boolean,
  authorUID: string,
  pollUID: string,
  createdAt: Date,
  pollNumber: number,
): List<PollAnswer> => {
  const answers: Array<PollAnswer> = new Array<PollAnswer>()

  const answerTemplate = {
    basic: true,
    status: PollAnswerStatus.PUBLISHED,
    createdAt,
    authorUID,
    pollUID,
  }

  if (lastnameAnswers) {
    if (pollNumber % 11 === 0) {
      readyAnswers['lastnames11'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    } else if (pollNumber % 6 === 0) {
      readyAnswers['lastnames6'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    } else if (pollNumber % 4 === 0) {
      readyAnswers['lastnames4'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    } else {
      readyAnswers['lastnames2'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    }
  } else {
    if (pollNumber % 5 === 0) {
      readyAnswers['answers5'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    } else if (pollNumber % 3 === 0) {
      readyAnswers['answers3'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    } else {
      readyAnswers['answers2'][lang].forEach((title, index) => {
        answers.push({ ...answerTemplate, title, index, uid: uuidv4() })
      })
    }
  }

  return List(answers)
}

export function generatePollsByTitles(
  titles: Array<ArticleTitleDefinition>,
  author: User,
  year: number,
  lastnameAnswers: boolean,
): Array<Poll> {
  const pollTemplate = {
    tags: generateTags(),
    complexWorkflow: false,
    anonymous: false,
    taGenders: List([]),
    status: PollStatus.COMPLETED,
  }

  return titles.map((title: ArticleTitleDefinition) => {
    const pollNumber = counter.nextTick()

    // basic number + random number
    // for example:
    //   1. 50 000 + 500
    //   2. 50 000 + 410 500
    const numberOfVotes =
      BASIC_VOTES_NUMBER * VOTES_MULTIPLIER +
      5 * ((pollNumber % 13) * (pollNumber % 11) * (pollNumber % 7) + 1) * VOTES_MULTIPLIER

    const lang = pollNumber % 2 === 1 ? Language.UA : Language.RU
    const votingLengthDays = 7 + (pollNumber % 24) // 7 -> 30 days

    const pollUID = 'eeeeeeee-aaaa-aaaa-aaaa-000000000' + pollNumber
    const createdAt = generateDate(pollNumber, year)
    // TODO: check, if date is correctly shifted, when day exceeds 31
    const publishedAt = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate() + 1, // published in 1 day after creation
      0,
      0,
      0,
    )
    const votingStartAt = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate() + 2, // voting starts in 2 days after creation
      0,
      0,
      0,
    )
    const votingEndAt = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate() + 2 + votingLengthDays, // voting ends in [votingLength] days after start
      0,
      0,
      0,
    )

    const answers = generateAnswers4Poll(
      lang,
      lastnameAnswers,
      author.uid as string,
      pollUID,
      createdAt,
      pollNumber,
    )

    const poll: Poll = {
      ...pollTemplate,
      uid: pollUID,
      theme: PollsThemes[pollNumber % PollsThemes.length],
      title: title[lang] as string,
      body: generateBodyText(lang, pollNumber).substr(0, 256),
      competencyTags: List([]),
      createdAt,
      publishedAt,
      // discussionStartAt?: Date
      votingStartAt,
      votingEndAt,
      taAgeGroups: generateTAAgeGroups4Poll(pollNumber),
      taAddressRegion: Region.COUNTRY_WIDE,
      // taAddressDistrict?: string
      // taAddressTown?: string
      taSocialStatuses: generateTASocialStatuses4Poll(pollNumber),
      answers: answers,
      authorUID: author.uid as string,
      answersCount: answers.size,
      votesCount: numberOfVotes,
      commentsCount: 0,
      pollType: PollType.REGULAR,
    }

    return poll
  })
}

type VotingRoundData = {
  votingRound: VotingRound
  votes: Array<Vote>
  votingResult: Array<VotingResult>
}

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max))
}

function generateAgeGroup(): AgeGroup {
  const generatedValue = getRandomInt(6)
  switch (generatedValue) {
    case 0:
      return AgeGroup.TWENTY
    case 1:
      return AgeGroup.TWENTY_FIVE
    case 2:
      return AgeGroup.THIRTY_FIVE
    case 3:
      return AgeGroup.FORTY_FIVE
    case 4:
      return AgeGroup.FIFTY_FIVE

    default:
      return AgeGroup.FIFTY_SIX_PLUS
  }
}

function generateSocialStatus(): SocialStatus {
  const generatedValue = getRandomInt(6)
  switch (generatedValue) {
    case 0:
      return SocialStatus.MANAGER
    case 1:
      return SocialStatus.CLERK
    case 2:
      return SocialStatus.UNEMPLOYED
    case 3:
      return SocialStatus.STUDENT
    case 4:
      return SocialStatus.RETIREE

    default:
      return SocialStatus.SELFEMPLOYED
  }
}

function generateGender(): Gender {
  const generatedValue = getRandomInt(2)
  switch (generatedValue) {
    case 0:
      return Gender.MALE
    case 1:
      return Gender.FEMALE

    default:
      return Gender.UNSET
  }
}

function generateRegion(): Region {
  const generatedValue = getRandomInt(20)
  switch (generatedValue) {
    case 0:
      return Region.CHERKASY_REGION
    case 1:
      return Region.CHERNIHIV_REGION
    case 2:
      return Region.DNIPROPETROVSK_REGION
    case 3:
      return Region.DONETSK_REGION
    case 4:
      return Region.KHARKIV_REGION
    case 5:
      return Region.KHERSON_REGION
    case 6:
      return Region.KYIV_REGION
    case 7:
      return Region.KIROVOHRAD_REGION
    case 8:
      return Region.LVIV_REGION
    case 9:
      return Region.MYKOLAIV_REGION
    case 10:
      return Region.ODESSA_REGION
    case 11:
      return Region.POLTAVA_REGION
    case 12:
      return Region.RIVNE_REGION
    case 13:
      return Region.TERNOPIL_REGION
    case 14:
      return Region.VINNYTSIA_REGION
    case 15:
      return Region.ZAKARPATTIA_REGION
    case 16:
      return Region.ZAPORIZHZHIA_REGION
    case 17:
      return Region.KRYM_REGION

    default:
      return Region.KYIV_CITY_REGION
  }
}

function getRandomTownFromRegion(region: Region): string {
  const regionObj = RegionsUtility.findRegionObject(region) as RegionsAndDistricts

  const generatedValue = getRandomInt(regionObj.cities.length)

  return regionObj.cities[generatedValue].key
}

function getRandomDistrictFromRegion(region: Region): string {
  const regionObj = RegionsUtility.findRegionObject(region) as RegionsAndDistricts

  const generatedValue = getRandomInt(regionObj.districts.length)

  return regionObj.districts[generatedValue].key
}

function addDistrictOrTownByRegion(vote: Vote): Vote {
  const isTown = getRandomInt(2)

  if (isTown) {
    return { ...vote, addressTown: getRandomTownFromRegion(vote.addressRegion as Region) }
  }

  return { ...vote, addressDistrict: getRandomDistrictFromRegion(vote.addressRegion as Region) }
}

function generateVotesForPoll(poll: Poll): Array<Vote> {
  const result: Array<Vote> = new Array<Vote>()

  const votingStartAtMs = poll.votingStartAt.getTime()
  const votingEndAtMs = poll.votingEndAt.getTime()
  const votingLengthSec = Math.floor((votingEndAtMs - votingStartAtMs) / 1000) - 1 // -1 to finish at 1 sec before votingEndAt

  const answers = poll.answers.toArray()

  const votesCount = poll.votesCount as number
  for (let i = 0; i < votesCount; i += 1) {
    // We want to achieve a random voting timestamp within 30 days
    // 2592000 number of seconds in 30 days
    const votingShift = ((Math.random() * 2592000) % votingLengthSec) * 1000
    const vote: Vote = {
      pollAnswerUID: answers[getRandomInt(poll.answers.size)].uid as string,
      votingRoundUID: poll.uid as string,
      roundStatus: VotingRoundType.DISCUSSION,
      voterSeed: crypto
        .createHmac('sha256', 'secret')
        .update('I love cupcakes ' + new Date().getTime() + Math.random().toString())
        .digest('hex'),

      createdAt: new Date(votingStartAtMs + votingShift),

      ageGroup: generateAgeGroup(),
      gender: generateGender(),
      socialStatus: generateSocialStatus(),
      addressRegion: generateRegion(),
    }

    const voteWithCorrectAddress: Vote = addDistrictOrTownByRegion(vote)

    result.push(voteWithCorrectAddress)
  }

  return result
}

export function generatePollVotingData(poll: Poll): VotingRoundData {
  const votingRound: VotingRound = {
    uid: poll.uid,
    type: VotingRoundType.VOTING,
    createdAt: poll.createdAt,
    startedAt: poll.votingStartAt,
    endedAt: poll.votingEndAt,
  }

  const votes: Array<Vote> = generateVotesForPoll(poll)

  const votingResult: Array<VotingResult> = []

  if (poll.uid && poll.pollType === PollType.REGULAR) {
    const statisticsResult = StatisticService.getVotingResults(poll.uid, votes)

    if (statisticsResult.VOTES_DYNAMICS && statisticsResult.RESULTS_GEOGRAPHY) {
      votingResult.push(...statisticsResult.RESULTS_GEOGRAPHY)
      votingResult.push(...statisticsResult.VOTES_DYNAMICS)
    }
  }

  return {
    votingRound,
    votes,
    votingResult,
  }
}

export function globalLastnameThemesPolls(): Array<Poll> {
  const previousYear = DateUtility.now().getFullYear() - 1

  const generatedNews = publicUsers.map((user: User) => {
    return generatePollsByTitles(globalLastnameThemes, user, previousYear, true)
  })

  // flatten [][][] -> []
  return new Array<Poll>().concat(...new Array<Array<Poll>>().concat(...generatedNews))
}
