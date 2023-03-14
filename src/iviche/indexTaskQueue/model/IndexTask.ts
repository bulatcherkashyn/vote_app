import { GenericEntity } from '../../generic/model/GenericEntity'

export enum ReferenceType {
  POLL = 'poll',
  NEWS = 'news',
}

export enum Action {
  INDEX = 'index',
  DELETE = 'delete',
}

export interface IndexTask extends GenericEntity {
  referenceUID: string
  referenceType: ReferenceType
  action: Action
  createdAt?: Date
}
