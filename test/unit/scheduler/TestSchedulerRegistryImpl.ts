import { List } from 'immutable'

import { JobDefinition } from '../../../src/iviche/scheduler/jobs/JobDefinition'

export class TestSchedulerRegistryContext {
  schedulers = List<JobDefinition>([
    {
      initialize(): void {
        throw new Error("It's okay. Expected Error for initialize test")
      },
      destroy(): void {
        throw new Error("It's okay. Expected Error for destroy test")
      },
    },
  ])
}
