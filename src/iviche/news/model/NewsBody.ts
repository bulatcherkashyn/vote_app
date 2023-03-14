import { Language } from '../../common/Language'
import { GenericEntity } from '../../generic/model/GenericEntity'

export interface NewsBody extends GenericEntity {
  readonly language: Language
  readonly title: string
  readonly body: string
  readonly seoTitle: string
  readonly seoDescription: string
  readonly shortDescription: string
  readonly newsUID?: string
}
