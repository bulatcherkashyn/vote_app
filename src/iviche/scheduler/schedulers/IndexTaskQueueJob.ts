import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class IndexTaskQueueJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }

  // '*/5 * * * *' == every five minute
  private generateCronjob(): CronJob {
    return new CronJob(
      '*/5 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startElasticIndexer', 'index-task-queue.job')
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
