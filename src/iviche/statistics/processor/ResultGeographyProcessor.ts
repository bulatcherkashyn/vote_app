import { Region } from '../../common/Region'
import { RegionsUtility } from '../../common/utils/RegionsUtility'
import { logger } from '../../logger/LoggerFactory'
import { Vote } from '../../voting/model/Vote'
import { StatisticsType } from '../model/StatisticsType'
import { VotingKey } from '../model/VotingKey'
import { VoteProcessor } from './VoteProcessor'

// NOTE: no logging here, as it leads to great memory consumption
export class ResultGeographyProcessor implements VoteProcessor {
  private aggregation: Map<string, Map<string, number>> = new Map()

  private setInnerValue(
    key: string,
    districtOrTown: string,
    innerValue: Map<string, number>,
  ): void {
    const cityCount = innerValue.get(districtOrTown)
    if (cityCount) {
      this.aggregation.set(key, innerValue.set(districtOrTown, cityCount + 1))
    } else {
      this.aggregation.set(key, innerValue.set(districtOrTown, 1))
    }
  }

  public consume(vote: Vote): void {
    const key: VotingKey = {
      key0: vote.pollAnswerUID,
      key1: vote.addressRegion,
      key2: undefined,
    }

    const jsonKey = JSON.stringify(key)

    const innerValue = this.aggregation.get(jsonKey)

    let addressDistrictOrTown = vote.addressDistrict
    if (vote.addressTown) {
      addressDistrictOrTown =
        RegionsUtility.getCenterOf(vote.addressRegion as Region, vote.addressTown) ||
        vote.addressTown
    }

    if (addressDistrictOrTown) {
      if (!this.aggregation.has(jsonKey)) {
        this.aggregation.set(jsonKey, new Map().set(addressDistrictOrTown, 1))
        return
      }

      if (innerValue) {
        this.setInnerValue(jsonKey, addressDistrictOrTown, innerValue)
        return
      }

      logger.error('statistics.service.result-geography-processor.inner-value.missed')
      return
    }

    logger.error('statistics.service.result-geography-processor.address-data.missed')
  }

  public getAggregation(): Map<string, Map<string, number>> {
    return this.aggregation
  }

  public getStatisticsType(): StatisticsType {
    return StatisticsType.RESULTS_GEOGRAPHY
  }
}
