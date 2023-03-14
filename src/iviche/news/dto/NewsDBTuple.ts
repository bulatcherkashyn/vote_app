import { List } from 'immutable'

import { Language } from '../../common/Language'
import { AuthorDataQueryTuple } from '../../person/model/AuthorData'
import { NewsSection } from '../model/NewsSection'
import { NewsStatus } from '../model/NewsStatus'
import { NewsTheme } from '../model/NewsTheme'

export interface NewsDBTuple extends AuthorDataQueryTuple {
  readonly uid: string
  readonly tags: List<string>
  readonly authorUID: string
  readonly pollUID: string
  readonly alternativeLink: string
  readonly section: NewsSection
  readonly theme: NewsTheme
  readonly headerImage?: string
  readonly status: NewsStatus
  readonly createdAt?: Date
  readonly publishedAt?: Date
  readonly lastSyncAt?: Date
  readonly wpID: number
  readonly bodyUid: string
  readonly language: Language
  readonly seoTitle: string
  readonly seoDescription: string
  readonly title: string
  readonly body: string
  readonly shortDescription: string
  readonly newsUID?: string
  readonly commentsCount?: number
}
