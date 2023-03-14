import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class PollCommentCountJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  private generateCronjob(): CronJob {
    return new CronJob(
      '*/7 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startPollCommentCount', 'poll-comment-count.job')
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
