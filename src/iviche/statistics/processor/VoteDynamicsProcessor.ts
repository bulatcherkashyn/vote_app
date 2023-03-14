import { logger } from '../../logger/LoggerFactory'
import { Vote } from '../../voting/model/Vote'
import { StatisticsType } from '../model/StatisticsType'
import { VotingKey } from '../model/VotingKey'
import { VoteProcessor } from './VoteProcessor'

// NOTE: no logging here, as it leads to great memory consumption
export class VoteDynamicsProcessor implements VoteProcessor {
  private aggregation: Map<string, Map<string, number>> = new Map()

  private setInnerValue(key: string, date: string, innerValue: Map<string, number>): void {
    const datesCount = innerValue.get(date)
    if (datesCount) {
      this.aggregation.set(key, innerValue.set(date, datesCount + 1))
    } else {
      this.aggregation.set(key, innerValue.set(date, 1))
    }
  }

  public consume(vote: Vote): void {
    const key: VotingKey = {
      key0: vote.socialStatus,
      key1: vote.ageGroup,
      key2: vote.gender,
    }

    const jsonKey = JSON.stringify(key)
    const date = vote.createdAt?.toISOString().substring(0, 10)

    if (date && !this.aggregation.has(jsonKey)) {
      this.aggregation.set(jsonKey, new Map().set(date, 1))
    } else {
      const innerValue = this.aggregation.get(jsonKey)
      if (innerValue) {
        this.setInnerValue(jsonKey, date as string, innerValue)
      } else {
        logger.error('statistics.service.vote-dynamics-processor.inner-value.missed')
      }
    }
  }

  public getAggregation(): Map<string, Map<string, number>> {
    return this.aggregation
  }

  public getStatisticsType(): StatisticsType {
    return StatisticsType.VOTES_DYNAMICS
  }
}
