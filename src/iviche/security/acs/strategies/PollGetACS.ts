import { QueryBuilder } from 'knex'

import { UserRole } from '../../../common/UserRole'
import { PollStatus } from '../../../polls/models/PollStatus'
import { ACS } from '../models/ACS'

export class PollGetACS implements ACS {
  private readonly userId: string
  private readonly forbiddenStatuses: Array<PollStatus>
  public hasAccess = true
  public fullAccess = false

  constructor(userId: string, forbiddenStatuses: Array<PollStatus>) {
    this.userId = userId
    this.forbiddenStatuses = forbiddenStatuses
  }

  toSQL(): {} {
    const where = (builder: QueryBuilder): void => {
      builder.whereNotIn('poll.status', this.forbiddenStatuses)
      if (this.userId !== UserRole.ANONYMOUS) {
        builder.orWhere('poll.authorUID', this.userId)
      }
    }
    return where
  }

  toArray(): Array<string> {
    return [this.userId]
  }
}
