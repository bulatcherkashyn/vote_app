import { QueryBuilder } from 'knex'

type sortOrder = 'asc' | 'desc'

const applyOrderBy = (queryBuilder: QueryBuilder, sortColumn: string, order: sortOrder): void => {
  queryBuilder.orderBy(sortColumn, order)
}

export { applyOrderBy }
