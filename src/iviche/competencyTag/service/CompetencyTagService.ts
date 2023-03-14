import { CompetencyTag } from '../../common/CompetencyTag'

export interface CompetencyTagService {
  getCompetencyTags(): Array<CompetencyTag>

  getFlattenCompetencyTagsList(): Array<string>
}
