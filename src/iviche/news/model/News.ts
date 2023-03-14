import { List } from 'immutable'

import { GenericEntity } from '../../generic/model/GenericEntity'
import { NewsBody } from './NewsBody'
import { NewsSection } from './NewsSection'
import { NewsStatus } from './NewsStatus'
import { NewsTheme } from './NewsTheme'

export interface News extends GenericEntity {
  readonly alternativeLink: string
  readonly authorUID: string
  readonly pollUID?: string
  readonly tags: List<string>
  readonly status?: NewsStatus
  readonly section?: NewsSection
  readonly theme?: NewsTheme
  readonly headerImage?: string
  readonly createdAt?: Date
  readonly publishedAt?: Date
  readonly lastSyncAt?: Date
  readonly wpID: number
  readonly newsBodyList: List<NewsBody>
  readonly commentsCount?: number
}
