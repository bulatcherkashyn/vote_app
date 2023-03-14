import { List } from 'immutable'

import { Language } from '../../../src/iviche/common/Language'
import { DateUtility } from '../../../src/iviche/common/utils/DateUtility'
import { EnglishifyUtility } from '../../../src/iviche/common/utils/EnglishifyUtility'
import { URLUtility } from '../../../src/iviche/common/utils/URLUtility'
import { ApplicationError } from '../../../src/iviche/error/ApplicationError'
import { News } from '../../../src/iviche/news/model/News'
import { NewsBody } from '../../../src/iviche/news/model/NewsBody'
import { NewsSection } from '../../../src/iviche/news/model/NewsSection'
import { NewsStatus } from '../../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../../src/iviche/news/model/NewsTheme'
import { User } from '../../../src/iviche/users/models/User'
import { ArticleTitleDefinition } from './ArticleTitleDefinition'
import { Counter, generateDate } from './common'
import { expertPersons, expertUsers } from './data/AdditionalUsers'
import { generateBodyText } from './data/DummyTextData'
import { globalLastnameThemes } from './data/NewsData'
import { generateTags } from './TagsGenerator'

const counter = new Counter()

const NewsThemes = Object.values(NewsTheme)
const NewsSections = Object.values(NewsSection)

export function generateNewsByTitles(
  titles: Array<ArticleTitleDefinition>,
  author: User,
  year: number,
  suffix?: ArticleTitleDefinition,
): Array<News> {
  const newsTemplate = {
    tags: generateTags(),
    status: NewsStatus.PUBLISHED,
  }

  return titles.map((theme: ArticleTitleDefinition) => {
    const articleNumber = counter.nextTick()

    const titleUA = theme.UA + (suffix ? ` ${suffix.UA}` : '')
    const titleRU = theme.RU + (suffix ? ` ${suffix.RU}` : '')

    const alternativeLink = URLUtility.cleanupPhraseForLink(
      EnglishifyUtility.englishifyUkrainian(titleUA),
    )

    const articleBodyUA = generateBodyText(Language.UA, articleNumber)
    const articleBodyRU = generateBodyText(Language.RU, articleNumber)
    const newsBodies: Array<NewsBody> = [
      {
        uid: 'ffffffff-aaaa-aaaa-aaaa-a00000000' + articleNumber,
        language: Language.UA,
        title: titleUA,
        body: articleBodyUA,
        seoTitle: titleUA.substr(0, 20),
        seoDescription: articleBodyUA.substr(0, 128),
        shortDescription: articleBodyUA.substr(0, 128),
        newsUID: 'ffffffff-aaaa-aaaa-aaaa-000000000' + articleNumber,
      },
      {
        uid: 'ffffffff-aaaa-aaaa-aaaa-b00000000' + articleNumber,
        language: Language.RU,
        title: titleRU,
        body: articleBodyRU,
        seoTitle: titleRU.substr(0, 20),
        seoDescription: articleBodyRU.substr(0, 128),
        shortDescription: articleBodyRU.substr(0, 128),
        newsUID: 'ffffffff-aaaa-aaaa-aaaa-000000000' + articleNumber,
      },
    ]

    const publishedAt = generateDate(articleNumber, year)
    const readyNews: News = {
      ...newsTemplate,
      uid: 'ffffffff-aaaa-aaaa-aaaa-000000000' + articleNumber,
      wpID: articleNumber,
      alternativeLink,
      authorUID: author.uid as string,
      newsBodyList: List(newsBodies),
      publishedAt: publishedAt,
      lastSyncAt: publishedAt,
      section: NewsSections[articleNumber % NewsSections.length],
      theme: NewsThemes[articleNumber % NewsThemes.length],
    }

    return readyNews
  })
}

export function globalLastnameThemesNewsByExperts(): Array<News> {
  const years = [DateUtility.now().getFullYear() - 1, DateUtility.now().getFullYear()]

  const generatedNews = years.map((year: number) => {
    return expertUsers.map((user: User, userIndex: number) => {
      const person = expertPersons[userIndex]
      if (person) {
        const capitalName = person.firstName ? person.firstName.charAt(0) : ''
        const lastName = person.lastName
        const suffixUA = `- думка ${capitalName}. ${lastName} - ${year}`
        const suffixRU = `- мнение ${capitalName}. ${lastName} - ${year}`

        return generateNewsByTitles(globalLastnameThemes, user, year, {
          UA: suffixUA,
          RU: suffixRU,
        })
      } else {
        throw new ApplicationError(`Cannot find person for user [${user.uid}]`)
      }
    })
  })

  // flatten [][][] -> []
  return new Array<News>().concat(...new Array<Array<News>>().concat(...generatedNews))
}
