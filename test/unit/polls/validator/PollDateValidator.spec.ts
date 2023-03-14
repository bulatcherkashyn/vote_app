import { DateUtility } from '../../../../src/iviche/common/utils/DateUtility'
import { PollForm } from '../../../../src/iviche/polls/models/PollForm'
import { PollValidator } from '../../../../src/iviche/polls/validators/PollValidator'

describe('Poll date validator', () => {
  test('complexWorkflow - false', () => {
    // GIVEN date voite start tomorrow and vote end next day after
    const nextDay = DateUtility.getNextDay()
    const obj = {
      votingStartAt: nextDay.toISOString(),
      votingEndAt: DateUtility.getNextDay(nextDay).toISOString(),
    }

    //  WHEN check dates
    const checkDates = PollValidator.prototype['checkDatesComplexWorkflowFalse'](obj as PollForm)

    // THEN dont has error
    expect(checkDates.hasError).toBeFalsy()
  })

  test('complexWorkflow - true', () => {
    // GIVEN date discussion start tomorrow, voite start and vote end next day after the previous
    const nextDay = DateUtility.getNextDay()
    const nextDay2 = DateUtility.getNextDay(nextDay)
    const obj = {
      discussionStartAt: nextDay.toISOString(),
      votingStartAt: nextDay2.toISOString(),
      votingEndAt: DateUtility.getNextDay(nextDay).toISOString(),
    }

    //  WHEN check dates
    const checkDates = PollValidator.prototype['checkDatesComplexWorkflowTrue'](obj as PollForm)

    // THEN dont has error
    expect(checkDates.hasError).toBeFalsy()
  })
})
