import { List } from 'immutable'

import { AuthorData, AuthorDataQueryTuple } from '../../person/model/AuthorData'
import { NewsBody } from '../model/NewsBody'
import { NewsSection } from '../model/NewsSection'
import { NewsStatus } from '../model/NewsStatus'
import { NewsTheme } from '../model/NewsTheme'

export interface MutableNewsDTO extends AuthorDataQueryTuple {
  uid: string
  alternativeLink: string
  authorUID: string
  pollUID: string
  tags: List<string>
  status?: NewsStatus
  section?: NewsSection
  theme?: NewsTheme
  headerImage?: string
  wpID: number
  lastSyncAt?: Date
  createdAt?: Date
  publishedAt?: Date
  authorData?: AuthorData
  newsBodyList: Array<NewsBody>
  commentsCount?: number
}
