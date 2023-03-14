import { GenericEntity } from '../../generic/model/GenericEntity'

export interface Tag extends GenericEntity {
  value: string
  lastUseAt?: Date
  createdAt?: Date
}
