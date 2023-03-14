import 'reflect-metadata'

import { PollDTOHelper } from '../../../src/iviche/polls/db/PollDTOHelper'
import { PollDTOTuple } from '../../../src/iviche/polls/dto/PollDTOTuple'
import { pollArray, pollDTOList } from './services/PollServiceHelper'

describe('Polls DTO Helper tests', () => {
  test('construct simple poll', async () => {
    // GIVEN single poll in PollDTO objects
    const givenPoll = [pollDTOList[0], pollDTOList[1]]
    // WHEN construct to single poll with answers
    const construct = PollDTOHelper.constructPollArrayFromTuplesArray(givenPoll)
    // THEN successful construct to Poll
    expect(construct).toStrictEqual([pollArray[0]])
  })

  test('construct array poll', async () => {
    // GIVEN list polls in PollDTO
    const givenPoll: Array<PollDTOTuple> = pollDTOList
    // WHEN construct to array of polls
    const construct = PollDTOHelper.constructPollArrayFromTuplesArray(givenPoll)
    // THEN got array of polls
    expect(construct).toStrictEqual(pollArray)
  })
})
