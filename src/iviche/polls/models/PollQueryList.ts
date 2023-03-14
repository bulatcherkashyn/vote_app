import { EntityFilter } from '../../generic/model/EntityFilter'

export interface ElasticParams {
  searchTerm?: string
  title?: string
  theme?: string
  tags?: Array<string>
  exclTags?: Array<string>
  competencyTags?: Array<string>
  pollType?: string
  taAddressRegion?: string
  status?: Array<string>
  publishedAtStart?: Date
  publishedAtEnd?: Date
  authorUID?: string
}

export interface PollListFilter extends EntityFilter {
  elastic?: ElasticParams
}

// NOTE: It need for validation
export interface PollQueryListForValidator
  extends Omit<ElasticParams, 'publishedAtStart' | 'publishedAtEnd'>,
    EntityFilter {
  orderBy?: string
  publishedAtStart?: string
  publishedAtEnd?: string
}
