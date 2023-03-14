import { Region } from '../../common/Region'
import { News } from '../../news/model/News'
import { Poll } from '../../polls/models/Poll'

export interface Dashboard {
  region?: Region
  activeNationalPolls: Array<Poll>
  activeLocalPolls: Array<Poll>
  activePopularPolls: Array<Poll>
  latestNationalNews: Array<News>
  completedNationalPolls: Array<Poll>
}
