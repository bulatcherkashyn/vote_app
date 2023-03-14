import { GenericEntity } from '../../generic/model/GenericEntity'
import { IssueResolution } from './IssueResolution'

export interface IssueResolve extends GenericEntity {
  readonly resolution: IssueResolution
  readonly comment?: string
  readonly moderatorUID?: string
}
