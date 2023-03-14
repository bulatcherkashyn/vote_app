import * as Knex from 'knex'

import { NewsUtility } from '../../../src/iviche/common/NewsUtility'
import { PollUtility } from '../../../src/iviche/common/PollUtility'
import { Elastic } from '../../../src/iviche/elastic/Elastic'
import { EntityNames } from '../../../src/iviche/elastic/EntityNames'
import { News } from '../../../src/iviche/news/model/News'
import { Person } from '../../../src/iviche/person/model/Person'
import { Poll } from '../../../src/iviche/polls/models/Poll'
import { PollAnswer } from '../../../src/iviche/polls/models/PollAnswer'
import { User } from '../../../src/iviche/users/models/User'
import { UserDetails } from '../../../src/iviche/users/models/UserDetails'
import {
  additionalPersonsData,
  additionalUserDetailsData,
  additionalUsersData,
} from './data/AdditionalUsers'
import { globalLastnameThemesNewsByExperts } from './NewsGenerator'
import { generatePollVotingData, globalLastnameThemesPolls } from './PollsGenerator'

const _globalPersons: Array<Person> = additionalPersonsData
const _globalUserDetails: Array<UserDetails> = additionalUserDetailsData
const _globalUsers: Array<User> = additionalUsersData
const _globalLastnameThemesPolls: Array<Poll> = [...globalLastnameThemesPolls()]

/* eslint-disable no-console */
export class GeneratedDataWriter {
  constructor(private connection: Knex, private elastic: Elastic) {}

  private async writePersonsToDatabase(): Promise<void> {
    await this.connection.table('person').insert(_globalPersons)
    console.log(`Persons writing done. Created [${_globalPersons.length}] objects.`)
  }

  private async writeUsersToDatabase(): Promise<void> {
    await this.connection.table('users').insert(_globalUsers)
    console.log(`Users writing done. Created [${_globalUsers.length}] objects.`)
  }

  private async writeUserDetailsToDatabase(): Promise<void> {
    await this.connection.table('user_details').insert(_globalUserDetails)
    console.log(`UserDetails writing done. Created [${_globalUserDetails.length}] objects.`)
  }

  private async writeNewsToDatabase(): Promise<void> {
    const _globalLastnameThemesNewsByExperts: Array<News> = globalLastnameThemesNewsByExperts()

    const newsBodiesUa = _globalLastnameThemesNewsByExperts.map(r => r.newsBodyList.get(0))
    const newsBodiesRu = _globalLastnameThemesNewsByExperts.map(r => r.newsBodyList.get(1))

    const newsNativeData = _globalLastnameThemesNewsByExperts.map((news: News) => {
      const { newsBodyList, ...newsWithoutBodies } = news
      return newsWithoutBodies
    })

    await this.connection.table('news').insert(newsNativeData)
    const elasticData = _globalLastnameThemesNewsByExperts.map(el => NewsUtility.toNewsIndex(el))
    await this.elastic.bulk(EntityNames.news, elasticData)
    console.log(`News writing done. Created [${newsNativeData.length}] objects.`)

    await this.connection.table('news_body').insert(newsBodiesUa)
    console.log(`NewsBody UA writing done. Created [${newsBodiesUa.length}] objects.`)

    await this.connection.table('news_body').insert(newsBodiesRu)
    console.log(`NewsBody RU writing done. Created [${newsBodiesRu.length}] objects.`)
  }

  private async writePollsToDatabase(): Promise<void> {
    const answers: Array<Array<PollAnswer>> = _globalLastnameThemesPolls.map(r =>
      r.answers.toArray(),
    )

    const nativePollsData = _globalLastnameThemesPolls.map((poll: Poll) => {
      const { answers, ...pollWithoutAnswers } = poll
      return pollWithoutAnswers
    })

    // flatten [][] -> []
    const flattenAnswers: Array<PollAnswer> = ([] as Array<PollAnswer>).concat(...answers)

    await this.connection.table('poll').insert(nativePollsData)
    const elasticData = _globalLastnameThemesPolls.map(el => PollUtility.toPollIndex(el))
    await this.elastic.bulk(EntityNames.poll, elasticData)

    console.log(`Polls writing done. Created [${nativePollsData.length}] objects.`)

    await this.connection.table('poll_answer').insert(flattenAnswers)
    console.log(`Poll answers writing done. Created [${flattenAnswers.length}] objects.`)
  }

  private async writeVotesToDatabase(): Promise<void> {
    let votesCount = 0
    for (const poll of _globalLastnameThemesPolls) {
      const votingData = generatePollVotingData(poll)

      await this.connection.table('voting_round').insert(votingData.votingRound)

      let temporaryVotes = []
      for (let i = 0; i <= votingData.votes.length; i += 1) {
        temporaryVotes.push(votingData.votes[i])

        if (i % 1000 === 0 || i === votingData.votes.length - 1) {
          await this.connection.table('vote').insert(temporaryVotes)
          temporaryVotes = []
        }
        votesCount += 1
      }

      let temporaryVotingResults = []
      for (let i = 0; i <= votingData.votingResult.length; i += 1) {
        temporaryVotingResults.push(votingData.votingResult[i])

        if (i % 1000 === 0 || i === votingData.votingResult.length - 1) {
          await this.connection.table('voting_result').insert(temporaryVotingResults)
          temporaryVotingResults = []
        }
      }
      console.log(`Voting results writing done. Poll [${poll.uid}].`)
      console.log(`Votes count [${votingData.votes.length}].`)
    }
    console.log(`Total votes count [${votesCount}].`)
  }

  public async writeData(): Promise<void> {
    const start = Date.now()

    await this.writePersonsToDatabase()
    await this.writeUsersToDatabase()
    await this.writeUserDetailsToDatabase()
    await this.writeNewsToDatabase()
    await this.writePollsToDatabase()
    await this.writeVotesToDatabase()

    const end = Date.now()

    console.log('time:', end - start)
  }
}
