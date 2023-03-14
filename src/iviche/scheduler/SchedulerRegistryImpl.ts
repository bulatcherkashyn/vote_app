import { List } from 'immutable'

import { JobDefinition } from './jobs/JobDefinition'
import { SchedulerRegistry } from './SchedulerRegistry'
import { BasicStatisticsCollectionJob } from './schedulers/BasicStatisticsCollectionJob'
import { DBCleanerJob } from './schedulers/DBCleanerJob'
import { DeleteOldNotificationsJob } from './schedulers/DeleteOldNotificationsJob'
import { IndexTaskQueueJob } from './schedulers/IndexTaskQueueJob'
import { NewsCommentCountJob } from './schedulers/NewsCommentCountJob'
import { PollCommentCountJob } from './schedulers/PollCommentCountJob'
import { PollTrackerJob } from './schedulers/PollTrackerJob'
import { SaveBannersFromWpJob } from './schedulers/SaveBannersFromWpJob'
import { SaveNewsFromWpJob } from './schedulers/SaveNewsFromWpJob'
import { VotingStatisticsCollectionJob } from './schedulers/VotingStatisticsCollectionJob'

export class SchedulerRegistryImpl implements SchedulerRegistry {
  private readonly schedulers: List<JobDefinition>
  constructor() {
    this.schedulers = List<JobDefinition>([
      new DBCleanerJob(),
      new VotingStatisticsCollectionJob(),
      new PollTrackerJob(),
      new IndexTaskQueueJob(),
      new BasicStatisticsCollectionJob(),
      new SaveNewsFromWpJob(),
      new PollCommentCountJob(),
      new NewsCommentCountJob(),
      new SaveBannersFromWpJob(),
      new DeleteOldNotificationsJob(),
    ])
  }

  public initialize(): void {
    this.schedulers.forEach((scheduler: JobDefinition) => {
      scheduler.initialize()
    })
  }

  public destroy(): void {
    this.schedulers.forEach((scheduler: JobDefinition) => {
      scheduler.destroy()
    })
  }
}
