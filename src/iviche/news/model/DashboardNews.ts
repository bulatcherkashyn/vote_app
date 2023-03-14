import { Poll } from '../../polls/models/Poll'
import { News } from './News'

export interface DashboardNews {
  latestNews: Array<News>
  mainNews: Array<News>
  themedNews: ThemedNews
  analyticalNews: Array<News> | undefined
  activePopularPolls: Array<Poll>
}

export interface ThemedNews {
  [theme: string]: Array<News>
}
