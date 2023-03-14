import 'reflect-metadata'

import { NewsDTOHelper } from '../../../../src/iviche/news/db/NewsDTOHelper'
import { NewsDBTuple } from '../../../../src/iviche/news/dto/NewsDBTuple'
import { NewsTheme } from '../../../../src/iviche/news/model/NewsTheme'
import { newsDBTupleList, newsObjList } from './NewsTestHelper'

describe('News DTO Helper tests', () => {
  test('construct simple news array', async () => {
    const givenNewsArray: Array<NewsDBTuple> = newsDBTupleList

    const construct = NewsDTOHelper.constructNewsArrayFromTuplesArray(givenNewsArray)

    expect(construct).toStrictEqual(newsObjList)
  })

  test('construct grouped theme news', async () => {
    const givenNewsArray: Array<NewsDBTuple> = newsDBTupleList

    const constructNewsArray = NewsDTOHelper.constructNewsArrayFromTuplesArray(givenNewsArray)
    const construct = NewsDTOHelper.constructThemedNewsGroups(constructNewsArray)

    const themedNewsObj = {
      [NewsTheme.POLITICAL_MAP]: [],
      [NewsTheme.ECONOMY]: [newsObjList[0], newsObjList[1]],
      [NewsTheme.PUBLIC_INTEREST]: [],
      [NewsTheme.SCIENCE_AND_EDUCATION]: [],
      [NewsTheme.CULTURAL_SPACE]: [],
    }
    expect(construct).toStrictEqual(themedNewsObj)
  })
})
