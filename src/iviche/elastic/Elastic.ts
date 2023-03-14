import { Client } from '@elastic/elasticsearch'
import { ResponseError } from '@elastic/elasticsearch/lib/errors'

import { EnvironmentMode } from '../common/EnvironmentMode'
import { ConflictErrorCodes } from '../error/DetailErrorCodes'
import { ServerError } from '../error/ServerError'
import { GenericEntity } from '../generic/model/GenericEntity'
import { logger } from '../logger/LoggerFactory'

interface HitsData<T> {
  _index: string
  _type: string
  _id: string
  _score: number
  _source: T
}

interface HitsTotal {
  value: number
  relation: string
}

export interface ElasticSearchHits<T> {
  total: HitsTotal
  max_score: number
  hits: Array<HitsData<T>>
}
export class Elastic {
  private static processElasticError(e: ResponseError, index: string): ServerError {
    if (e.statusCode === 409) {
      return new ServerError(
        `Version conflict on update Elastic index "${index}".`,
        409,
        ConflictErrorCodes.UNKNOWN_CONFLICT_ERROR,
        'elastic',
      )
    } else {
      return new ServerError(
        `Elastic update "${index}" index failed`,
        e?.statusCode || undefined,
        undefined,
        'elastic',
      )
    }
  }
  private client: Client

  constructor() {
    const url = EnvironmentMode.isTest() ? process.env.ELASTIC_HOST_TEST : process.env.ELASTIC_HOST
    this.client = new Client({ node: url || 'http://localhost:9200' })
  }

  public async index<T>(id: string, index: string, body: T): Promise<void> {
    await this.client.index({ id, index, body })
  }

  public async bulk<T extends GenericEntity>(index: string, array: Array<T>): Promise<void> {
    if (!array.length) {
      return
    }
    const body = array.flatMap(doc => [{ index: { _index: index, _id: doc.uid } }, doc])

    await this.client.bulk({ refresh: 'true', body })
  }

  public async search<T>(
    index: string,
    query?: {},
    size?: number,
    sort?: {},
    offset?: number,
  ): Promise<ElasticSearchHits<T>> {
    try {
      const pagination = size ? { size: size } : { size: 1000 }
      const body = query ? { query } : {}
      const sortQuery = sort ? { sort } : {}
      const offsetQuery = offset ? { from: offset } : {}

      const res = await this.client.search({
        index,
        body: { ...body, ...pagination, ...sortQuery, ...offsetQuery },
      })
      return res.body.hits
    } catch (e) {
      if (e.meta && e.meta.statusCode === 404) {
        return {
          total: { value: 0, relation: 'eq' },
          max_score: 0, // eslint-disable-line @typescript-eslint/camelcase
          hits: [],
        }
      }
      logger.error('elastic-search-failed', e.meta)
      throw e
    }
  }

  public async count(index: string, query?: {}): Promise<number> {
    try {
      const body = query ? { query } : {}

      const res = await this.client.count({
        index,
        body: { ...body },
      })
      return res.body.count
    } catch (e) {
      if (e.meta && e.meta.statusCode === 404) {
        return 0
      }
      logger.error('elastic-search-failed', e.meta)
      throw e
    }
  }

  public async updateByQuery(index: string, script: {}, query: {}): Promise<void | ServerError> {
    try {
      await this.client.updateByQuery({ index, refresh: true, body: { script, query } })
    } catch (e) {
      return Elastic.processElasticError(e, index)
    }
  }

  public async update(uid: string, index: string, script: {}): Promise<void | ServerError> {
    try {
      await this.client.update({
        id: uid,
        index,
        refresh: 'true',
        // eslint-disable-next-line @typescript-eslint/camelcase
        retry_on_conflict: 2,
        body: { script },
      })
    } catch (e) {
      return Elastic.processElasticError(e, index)
    }
  }

  public async delete(id: string, index: string): Promise<number> {
    try {
      await this.client.delete({ id, index })
      return 1
    } catch (e) {
      if (e.meta.statusCode === 404) {
        return 0
      }
      throw e
    }
  }

  public async deleteMany(ids: Array<string>, index: string): Promise<void> {
    const body = ids.map(id => ({ delete: { _index: index, _id: id } }))
    await this.client.bulk({ body })
  }

  public async clearAll(): Promise<void> {
    await this.client.indices.delete({ index: '_all' })
  }
}
