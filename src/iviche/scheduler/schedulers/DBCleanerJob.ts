import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class DBCleanerJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  // '0 2 * * *' == at 02:00 every day
  private generateCronjob(): CronJob {
    return new CronJob(
      '0 2 * * *',
      (): void => {
        ChildProcessHandler.runScript('startDBCleaner', 'database-cleaner.job')
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
