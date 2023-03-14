import { GenericEntity } from '../../generic/model/GenericEntity'

export interface NewsIndex extends GenericEntity {
  authorName?: string
  tags: string
  status?: string
  section?: string
  theme?: string
  publishedAt?: Date
  hasPollLink: boolean
  newsBody: string
}
