import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class PollTrackerJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  // '10 0 */1 * * *' == every hour at XX:00:10
  private generateCronjob(): CronJob {
    return new CronJob(
      '10 0 */1 * * *',
      (): void => {
        ChildProcessHandler.runScript('startPollTracker', 'poll-tracker.job')
      },
      undefined,
      false,
      'UTC',
    )
  }

  public initialize(): void {
    this.job.start()
  }

  public destroy(): void {
    this.job.stop()
  }
}
