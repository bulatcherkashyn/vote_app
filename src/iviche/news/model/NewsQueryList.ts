import { EntityFilter } from '../../generic/model/EntityFilter'

export interface ElasticParams {
  searchTerm?: string
  section?: string
  theme?: string
  tags?: Array<string>
  exclTags?: Array<string>
  publishedAtStart?: Date
  publishedAtEnd?: Date
  hasPollLink?: boolean
}

export interface NewsListFilter extends EntityFilter {
  elastic?: ElasticParams
}

// NOTE: It need for validation
export interface NewsQueryListForValidator
  extends Omit<ElasticParams, 'publishedAtStart' | 'publishedAtEnd'>,
    EntityFilter {
  orderBy?: string
  publishedAtStart?: string
  publishedAtEnd?: string
}
