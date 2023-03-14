import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class DeleteOldNotificationsJob implements JobDefinition {
  private deleteOldNotificationsJob: CronJob

  constructor() {
    this.deleteOldNotificationsJob = this.getDeleteNotificationsJob()
  }

  // '0 0 1 * *' === first day of a month
  private getDeleteNotificationsJob(): CronJob {
    return new CronJob(
      '0 0 1 * *',
      (): void => {
        ChildProcessHandler.runScript('startDeleteOldNotifications', 'delete-notifications-job')
      },
      undefined,
      false,
      'UTC',
    )
  }

  public initialize(): void {
    this.deleteOldNotificationsJob.start()
  }

  public destroy(): void {
    this.deleteOldNotificationsJob.stop()
  }
}
