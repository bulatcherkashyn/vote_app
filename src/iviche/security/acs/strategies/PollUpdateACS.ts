import { QueryBuilder } from 'knex'

import { PollStatus } from '../../../polls/models/PollStatus'
import { ACS } from '../models/ACS'

export class PollUpdateACS implements ACS {
  private readonly userId: string
  public hasAccess = true
  public fullAccess = false

  constructor(userId: string) {
    this.userId = userId
  }

  toSQL(): {} {
    const where = (builder: QueryBuilder): void => {
      builder
        .where('poll.authorUID', this.userId)
        .whereIn('poll.status', [PollStatus.DRAFT, PollStatus.REJECTED])
    }
    return where
  }

  toArray(): Array<string> {
    return [this.userId]
  }
}
