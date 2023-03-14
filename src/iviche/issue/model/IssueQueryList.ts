import { EntityFilter } from '../../generic/model/EntityFilter'
import { IssueResolution } from './IssueResolution'
import { IssueType } from './IssueType'

export interface IssueListFilter extends EntityFilter {
  type?: Array<IssueType>
  resolution?: Array<IssueResolution>
}

export interface IssueQueryListForValidator extends EntityFilter {
  type?: Array<string>
  resolution?: Array<string>
}
