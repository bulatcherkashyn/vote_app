import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class SaveBannersFromWpJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  // '*/5 * * * *' === At every 5th minute
  private generateCronjob(): CronJob {
    return new CronJob(
      '*/5 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startSaveBannersFromWp', 'save-banners-from-wp.job')
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
