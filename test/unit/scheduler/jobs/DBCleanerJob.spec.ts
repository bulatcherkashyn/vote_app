import { CronJob } from 'cron'

import { DBCleanerJob } from '../../../../src/iviche/scheduler/schedulers/DBCleanerJob'
import { TestCronJob } from './TestCronJob'

const testDBCleanerJob = new DBCleanerJob()
;(testDBCleanerJob['job'] as TestCronJob) = {
  start(): void {
    throw new Error("It's okay. Expected Error for initialize test")
  },
  stop(): void {
    throw new Error("It's okay. Expected Error for destroy test")
  },
}

describe('Scheduler. Job. DBCleanerJob', () => {
  test('generateCronjob', () => {
    // GIVEN DBCleanerJob
    const testDBCleanerJob = new DBCleanerJob()

    // WHEN getting a job
    const result: CronJob = testDBCleanerJob['generateCronjob']()

    // THEN we have a job thats ready to be used
    result.start()
    expect(result.running).toBeTruthy()
    result.stop()
  })

  test('initialize', () => {
    // GIVEN mocked CronJob object
    try {
      // WHEN db cleaner jobs initialize
      testDBCleanerJob.initialize()
    } catch (error) {
      // THEN we catch special error than indicates a successful execution
      expect(error.message).toBe("It's okay. Expected Error for initialize test")
    }
  })

  test('destroy', () => {
    // GIVEN mocked CronJob object
    try {
      // WHEN db cleaner jobs destroy
      testDBCleanerJob.destroy()
    } catch (error) {
      // THEN we catch special error than indicates a successful execution
      expect(error.message).toBe("It's okay. Expected Error for destroy test")
    }
  })
})
