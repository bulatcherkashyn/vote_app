import { CronJob } from 'cron'

import { JobDefinition } from '../jobs/JobDefinition'
import { ChildProcessHandler } from '../utility/ChildProcessHandler'

export class VotingStatisticsCollectionJob implements JobDefinition {
  private collectVotingResultsJob: CronJob

  constructor() {
    this.collectVotingResultsJob = this.getCollectVotingResultsJob()
  }

  // '*/15 * * * *' == every 15 min
  private getCollectVotingResultsJob(): CronJob {
    return new CronJob(
      '*/15 * * * *',
      (): void => {
        ChildProcessHandler.runScript('startCollectVotingResults', 'CollectVotingResultsJob')
      },
      undefined,
      false,
      'UTC',
    )
  }

  public initialize(): void {
    this.collectVotingResultsJob.start()
  }

  public destroy(): void {
    this.collectVotingResultsJob.stop()
  }
}
