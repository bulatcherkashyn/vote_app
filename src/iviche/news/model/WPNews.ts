import { NewsBody } from './NewsBody'
import { NewsSection } from './NewsSection'
import { NewsStatus } from './NewsStatus'
import { NewsTheme } from './NewsTheme'

export interface WPNews {
  readonly uid?: string
  readonly idPost: number
  readonly alternativeLink: string
  readonly authorUID: number
  readonly pollUID?: string
  readonly postDate: string
  readonly postModified: string
  readonly tags: Array<string>
  readonly status: NewsStatus
  readonly theme: NewsTheme
  readonly headerImage?: string
  readonly newsSection: NewsSection
  readonly newsBodyList: Array<NewsBody>
}
