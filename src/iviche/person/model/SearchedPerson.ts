import { GenericEntity } from '../../generic/model/GenericEntity'

export interface SearchedPerson extends GenericEntity {
  readonly email?: string
  readonly uid?: string
}
