import { GenericEntity } from '../../generic/model/GenericEntity'
import { ModerationResolutionType } from './ModerationResolutionType'

export interface ModerationResolve extends GenericEntity {
  readonly resolution: ModerationResolutionType
  readonly concern?: string
  readonly moderatorUID?: string
  readonly lockingCounter: number
}
