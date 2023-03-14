import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class SaveNewsFromWpJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  // '1 */1 * * *' == At minute 1 past every hour
  private generateCronjob(): CronJob {
    return new CronJob(
      '1 */1 * * *',
      (): void => {
        ChildProcessHandler.runScript('startSaveNewsFromWp', 'save-news-from-wp.job')
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
