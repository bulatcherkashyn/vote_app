import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class BasicStatisticsCollectionJob implements JobDefinition {
  private collectBasicStatisaticsJob: CronJob

  constructor() {
    this.collectBasicStatisaticsJob = this.getCollectBasicStatisticsJob()
  }

  // '*/10 * * * *' == every 10 min
  private getCollectBasicStatisticsJob(): CronJob {
    return new CronJob(
      '*/10 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startCollectBasicStatisitcs', 'collect-basic-statistics-job')
      },
      undefined,
      false,
      'UTC',
    )
  }

  public initialize(): void {
    this.collectBasicStatisaticsJob.start()
  }

  public destroy(): void {
    this.collectBasicStatisaticsJob.stop()
  }
}
