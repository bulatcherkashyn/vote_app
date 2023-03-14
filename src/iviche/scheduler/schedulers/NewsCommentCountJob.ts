import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class NewsCommentCountJob implements JobDefinition {
  private job: CronJob

  constructor() {
    this.job = this.generateCronjob()
  }
  // '*/15 * * * *' = every 15 minutes
  private generateCronjob(): CronJob {
    return new CronJob(
      '*/15 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startNewsCommentCount', 'news-comment-count.job')
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
