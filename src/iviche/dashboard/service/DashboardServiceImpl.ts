import { inject, injectable } from 'tsyringe'

import { Region } from '../../common/Region'
import { logger } from '../../logger/LoggerFactory'
import { DashboardNews, ThemedNews } from '../../news/model/DashboardNews'
import { News } from '../../news/model/News'
import { NewsService } from '../../news/services/NewsService'
import { Poll } from '../../polls/models/Poll'
import { PollOrderBy } from '../../polls/models/PollOrderBy'
import { PollListFilter } from '../../polls/models/PollQueryList'
import { PollStatus } from '../../polls/models/PollStatus'
import { PollService } from '../../polls/services/PollService'
import { GrandAccessACS } from '../../security/acs/strategies'
import { Dashboard } from '../model/Dashboard'
import { DashboardService } from './DashboardService'

@injectable()
export class DashboardServiceImpl implements DashboardService {
  constructor(
    @inject('PollService') private pollService: PollService,
    @inject('NewsService') private newsService: NewsService,
  ) {}

  public async mainDashboard(region: Region): Promise<Dashboard> {
    logger.debug('dashboard.service.main.start')

    const activeNationalPolls = await this.getNationalPolls()
    const activeLocalPolls = await this.getLocalPolls(region)
    const activePopularPolls = await this.getPopularPolls()
    const completedNationalPolls = await this.getCompletedPolls()
    const latestNationalNews = await this.getLatestNews(6)

    logger.debug('dashboard.service.main.done')

    return {
      region,
      activeNationalPolls,
      activeLocalPolls,
      activePopularPolls,
      latestNationalNews,
      completedNationalPolls,
    }
  }

  public async getDashboardNews(): Promise<DashboardNews> {
    logger.debug('dashboard.service.get-dashboard-news.start')

    const latestNews = await this.getLatestNews(20)
    const mainNews = await this.getMainNews(10)
    const themedNews = await this.getGroupedThemeNews(8)
    const analyticalNews = await this.getAnalyticalNews(4)
    const activePopularPolls = await this.getPopularPolls()
    logger.debug('dashboard.service.get-dashboard-news.done')

    return {
      latestNews,
      themedNews,
      analyticalNews,
      activePopularPolls,
      mainNews,
    }
  }

  private async getNationalPolls(): Promise<Array<Poll>> {
    const filter: PollListFilter = {
      limit: 3,
      offset: 0,
      order: { orderBy: PollOrderBy.LATEST },
      elastic: {
        status: [PollStatus.DISCUSSION, PollStatus.VOTING],
        taAddressRegion: Region.COUNTRY_WIDE,
      },
    }

    const nationalPolls = await this.pollService.list(filter, new GrandAccessACS())
    return nationalPolls.list.toArray()
  }

  private async getLocalPolls(region: Region): Promise<Array<Poll>> {
    const filter: PollListFilter = {
      limit: 3,
      offset: 0,
      order: { orderBy: PollOrderBy.LATEST },
      elastic: {
        status: [PollStatus.DISCUSSION, PollStatus.VOTING],
        taAddressRegion: region as string,
      },
    }

    const localPolls = await this.pollService.list(filter, new GrandAccessACS())
    return localPolls.list.toArray()
  }

  private async getPopularPolls(): Promise<Array<Poll>> {
    const filter: PollListFilter = {
      limit: 6,
      offset: 0,
      order: { orderBy: PollOrderBy.MOST_VOTES },
      elastic: {
        status: [PollStatus.DISCUSSION, PollStatus.VOTING],
      },
    }

    const localPolls = await this.pollService.list(filter, new GrandAccessACS())
    return localPolls.list.toArray()
  }

  private async getCompletedPolls(): Promise<Array<Poll>> {
    const filter: PollListFilter = {
      limit: 5,
      offset: 0,
      order: { orderBy: PollOrderBy.LATEST },
      elastic: { status: [PollStatus.FINISHED, PollStatus.COMPLETED] },
    }

    const localPolls = await this.pollService.list(filter, new GrandAccessACS())
    return localPolls.list.toArray()
  }

  private async getLatestNews(rowsNumber: number): Promise<Array<News>> {
    const filter: PollListFilter = {
      limit: rowsNumber,
      offset: 0,
      order: { orderBy: 'publishedAt', asc: false },
    }

    const localPolls = await this.newsService.list(filter, new GrandAccessACS())
    return localPolls.list.toArray()
  }

  private async getGroupedThemeNews(rowsNumber: number): Promise<ThemedNews> {
    return this.newsService.getGroupedThemeNews(rowsNumber)
  }

  private async getAnalyticalNews(rowsNumber: number): Promise<Array<News>> {
    return this.newsService.getAnalyticalNews(rowsNumber)
  }

  private async getMainNews(rowsNumber: number): Promise<Array<News>> {
    return this.newsService.getMainNews(rowsNumber)
  }
}
