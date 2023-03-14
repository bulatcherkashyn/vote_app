import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { DateUtility } from '../../../common/utils/DateUtility'
import {
  ElasticParams,
  NewsListFilter,
  NewsQueryListForValidator,
} from '../../../news/model/NewsQueryList'

export class NewsListFilterConstructor
  implements ModelConstructor<NewsQueryListForValidator, NewsListFilter> {
  public constructRawForm(req: Request): NewsQueryListForValidator {
    const {
      offset,
      limit,
      searchTerm,
      section,
      theme,
      tags,
      publishedAtStart,
      publishedAtEnd,
      orderBy,
      hasPollLink,
    } = req.query

    return {
      orderBy,
      offset: offset || 0,
      limit: limit || 10,
      searchTerm,
      section,
      theme,
      tags: tags && tags.split(','),
      publishedAtStart: publishedAtStart && DateUtility.fromISO(publishedAtStart).toISOString(),
      publishedAtEnd: publishedAtEnd && DateUtility.fromISO(publishedAtEnd).toISOString(),
      hasPollLink,
    }
  }

  public constructPureObject(req: Request): NewsListFilter {
    const {
      offset,
      limit,
      searchTerm,
      section,
      theme,
      tags,
      exclTags,
      publishedAtStart,
      publishedAtEnd,
      orderBy,
      hasPollLink,
    } = req.query

    const elastic: ElasticParams = {
      searchTerm,
      theme,
      section,
      tags: tags && tags.split(','),
      exclTags: exclTags && exclTags.split(','),
      publishedAtStart: publishedAtStart && DateUtility.fromISO(publishedAtStart),
      publishedAtEnd: publishedAtEnd && DateUtility.fromISO(publishedAtEnd),
      hasPollLink,
    }

    const keys = Object.keys(elastic) as Array<keyof ElasticParams>
    keys.forEach(key => elastic[key] === undefined && delete elastic[key])

    const order = orderBy ? { orderBy, asc: false } : undefined
    return {
      order,
      offset: offset || 0,
      limit: limit || 100,
      elastic: Object.keys(elastic).length > 0 ? elastic : undefined,
    }
  }
}
