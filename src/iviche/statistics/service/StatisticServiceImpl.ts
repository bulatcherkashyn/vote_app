import { DateUtility } from '../../common/utils/DateUtility'
import { logger } from '../../logger/LoggerFactory'
import { Vote } from '../../voting/model/Vote'
import { VotingResult } from '../../voting/model/VotingResult'
import { StatisticsResult } from '../model/StatisticResult'
import { StatisticsHistogram } from '../model/StatisticsHistogram'
import { StatisticsType } from '../model/StatisticsType'
import { VotingKey } from '../model/VotingKey'
import { ResultGeographyProcessor } from '../processor/ResultGeographyProcessor'
import { VoteDynamicsProcessor } from '../processor/VoteDynamicsProcessor'
import { StatisticService } from './StatisticService'

export class StatisticServiceImpl implements StatisticService {
  private static checkVoteHealth(vote: Vote): boolean {
    /* eslint-disable prettier/prettier */
    return (
      !!vote.pollAnswerUID &&
      !!vote.ageGroup &&
      !!vote.gender &&
      !!vote.socialStatus &&
      !!vote.addressRegion &&
      // NOTE: Just a single should be present (only district or only town)
      ((!!vote.addressDistrict && !vote.addressTown) ||
        (!vote.addressDistrict && !!vote.addressTown)) &&
      !!vote.createdAt
    )
    /* eslint-enable prettier/prettier */
  }

  public getVotingResults(pollUID: string, votes: Array<Vote>): StatisticsResult {
    logger.debug('statistics.service.get-voting-results.start')

    const processors = [new ResultGeographyProcessor(), new VoteDynamicsProcessor()]

    votes.forEach(vote => {
      if (StatisticServiceImpl.checkVoteHealth(vote)) {
        processors.forEach(processor => processor.consume(vote))
      } else {
        logger.error('statistics.service.get-voting-results.broken-vote', vote)
      }
    })
    logger.debug('statistics.service.get-voting-results.consume.done')

    const aggregations = processors.map(processor => {
      return {
        type: processor.getStatisticsType(),
        aggregation: processor.getAggregation(),
      }
    })
    logger.debug('statistics.service.get-voting-results.aggregation.done')

    const plainStatisticsResult = aggregations.map(aggregation => {
      return {
        type: aggregation.type,
        data: this.processAggregation(pollUID, aggregation.aggregation, aggregation.type),
      }
    })
    logger.debug('statistics.service.get-voting-results.kpi-building.done')

    const results: StatisticsResult = {}
    plainStatisticsResult.forEach(statistic => {
      results[statistic.type] = statistic.data
    })

    logger.debug('statistics.service.get-voting-results.done')
    return results
  }

  private processAggregation(
    pollUID: string,
    aggregation: Map<string, Map<string, number>>,
    statisticsType: StatisticsType,
  ): Array<VotingResult> {
    logger.debug('statistics.service.process-aggregation.start')

    const votingResults: Array<VotingResult> = []
    const aggregationKeys = Array.from(aggregation.keys())

    for (const key of aggregationKeys) {
      const innerMap = aggregation.get(key)
      const parsedKey = JSON.parse(key) as VotingKey

      if (innerMap) {
        votingResults.push(this.buildVotingResults(pollUID, parsedKey, statisticsType, innerMap))
      } else {
        logger.error('statistic.service.process-aggregation.inner-map.missed', key)
      }
    }
    logger.debug('statistics.service.process-aggregation.done')
    return votingResults
  }

  private buildVotingResults(
    pollUID: string,
    parsedKey: VotingKey,
    statisticsType: StatisticsType,
    value: Map<string, number>,
  ): VotingResult {
    logger.debug('statistics.service.build-voting-results.start')

    const histograms: StatisticsHistogram = {}
    Array.from(value.keys()).forEach((key: string) => {
      const count = value.get(key)

      if (count) {
        histograms[key] = count
      }
      logger.debug('statistics.service.build-voting-results.done')
    })

    return {
      votingRoundUID: pollUID,
      statisticsType: statisticsType,
      key0: parsedKey.key0,
      key1: parsedKey.key1,
      key2: parsedKey.key2,
      value: histograms,

      finalAggregation: true,
      createdAt: DateUtility.now(),
    }
  }

  public buildAnswerValueStatistics(histogram: StatisticsHistogram, pollUID: string): VotingResult {
    return {
      votingRoundUID: pollUID,
      statisticsType: StatisticsType.ANSWER_VALUE,
      key0: undefined,
      key1: undefined,
      key2: undefined,
      value: histogram,

      finalAggregation: false,
      createdAt: DateUtility.now(),
    }
  }
}
