import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { DateUtility } from '../../../common/utils/DateUtility'
import {
  ElasticParams,
  PollListFilter,
  PollQueryListForValidator,
} from '../../../polls/models/PollQueryList'

export class PollListFilterConstructor
  implements ModelConstructor<PollQueryListForValidator, PollListFilter> {
  public constructRawForm(req: Request): PollQueryListForValidator {
    const {
      offset,
      limit,
      searchTerm,
      theme,
      title,
      tags,
      competencyTags,
      taAddressRegion,
      status,
      publishedAtStart,
      publishedAtEnd,
      author,
      pollType,
      orderBy,
    } = req.query

    return {
      orderBy,
      offset: offset || 0,
      limit: limit || 10,
      searchTerm,
      theme,
      title,
      tags: tags && tags.split(','),
      competencyTags: competencyTags && competencyTags.split(','),
      taAddressRegion,
      authorUID: author,
      pollType,
      status: status && status.split(','),
      publishedAtStart: publishedAtStart && DateUtility.fromISO(publishedAtStart).toISOString(),
      publishedAtEnd: publishedAtEnd && DateUtility.fromISO(publishedAtEnd).toISOString(),
    }
  }

  public constructPureObject(req: Request): PollListFilter {
    const {
      offset,
      limit,
      searchTerm,
      theme,
      tags,
      exclTags,
      title,
      competencyTags,
      taAddressRegion,
      status,
      pollType,
      publishedAtStart,
      publishedAtEnd,
      author,
      orderBy,
    } = req.query

    const elastic = {
      searchTerm,
      theme,
      title,
      authorUID: author,
      tags: tags && tags.split(','),
      exclTags: exclTags && exclTags.split(','),
      competencyTags: competencyTags && competencyTags.split(','),
      pollType,
      taAddressRegion,
      status: status && status.split(','),
      publishedAtStart: publishedAtStart && DateUtility.fromISO(publishedAtStart),
      publishedAtEnd: publishedAtEnd && DateUtility.fromISO(publishedAtEnd),
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
