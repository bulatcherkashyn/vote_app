import { injectable } from 'tsyringe'

import { CompetencyTag, competencyTagsList } from '../../common/CompetencyTag'
import { ApplicationError } from '../../error/ApplicationError'
import { logger } from '../../logger/LoggerFactory'
import { CompetencyTagService } from './CompetencyTagService'

@injectable()
export class CompetencyTagServiceImpl implements CompetencyTagService {
  private createFlattenCompetencyTagList(competencyTagsList: Array<CompetencyTag>): Array<string> {
    const result: Array<string> = []

    const getTagsKeyWithoutSubTags = (competencyTags: CompetencyTag): void => {
      if (competencyTags.isDeprecated) {
        return
      }

      if (!competencyTags.subTags) {
        result.push(competencyTags.key)
        return
      }

      competencyTags.subTags.filter(el => {
        return getTagsKeyWithoutSubTags(el)
      })
    }

    competencyTagsList.filter(cTag => {
      getTagsKeyWithoutSubTags(cTag)
    })

    if (new Set(result).size !== result.length) {
      throw new ApplicationError('Competency Tags duplicate keys error')
    }

    return result
  }

  private flatCompetencyTagList: Array<string>

  constructor() {
    this.flatCompetencyTagList = this.createFlattenCompetencyTagList(competencyTagsList)
  }

  public getCompetencyTags(): Array<CompetencyTag> {
    logger.debug('competency-tag.service.get-competency-tags')
    return competencyTagsList
  }

  public getFlattenCompetencyTagsList(): Array<string> {
    logger.debug('competency-tag.service.get-flatten-competency-tags-list')
    return this.flatCompetencyTagList
  }
}
