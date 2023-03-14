import { List } from 'immutable'

import { ValidationErrorCodes } from '../../error/DetailErrorCodes'
import { ServerError } from '../../error/ServerError'
import { logger } from '../../logger/LoggerFactory'
import { ObjectWithAuthorDataObject } from '../../person/model/AuthorData'
import { MutableNewsDTO } from '../dto/MutableNewsDTO'
import { NewsDBTuple } from '../dto/NewsDBTuple'
import { ThemedNews } from '../model/DashboardNews'
import { News } from '../model/News'
import { NewsBody } from '../model/NewsBody'
import { NewsTheme } from '../model/NewsTheme'

export class NewsDTOHelper {
  public static constructNewsArrayFromTuplesArray(newsTuples: Array<NewsDBTuple>): Array<News> {
    logger.debug('news.dto-helper.convert-list-tuples-to-news.start')
    const mutableNewsMap: Map<string, MutableNewsDTO> = new Map()

    newsTuples.forEach(tuple => {
      if (tuple.uid) {
        let newsDto = mutableNewsMap.get(tuple.uid)
        if (!newsDto) {
          newsDto = NewsDTOHelper.constructMutableNewsFromTuple(tuple)
          mutableNewsMap.set(tuple.uid, newsDto)
        }

        newsDto.newsBodyList.push(NewsDTOHelper.constructNewsBodyFromTuple(tuple))
      } else {
        // NOTE: this should really never happen
        throw new ServerError(
          'News without UID has been loaded',
          400,
          ValidationErrorCodes.UNKNOWN_VALIDATION_ERROR,
        )
      }
    })

    const res: Array<News> = Array.from(mutableNewsMap.values()).map(
      NewsDTOHelper.constructNewsFromMutableDTO,
    )

    logger.debug('news.dto-helper.convert-list-tuples-to-news.done')
    return res
  }

  public static constructMutableNewsFromTuple(tuple: NewsDBTuple): MutableNewsDTO {
    const newsTuple = {
      uid: tuple.uid,
      alternativeLink: tuple.alternativeLink,
      authorUID: tuple.authorUID,
      theme: tuple.theme,
      pollUID: tuple.pollUID,
      status: tuple.status,
      headerImage: tuple.headerImage,
      section: tuple.section,
      tags: tuple.tags,
      wpID: tuple.wpID,
      lastSyncAt: tuple.lastSyncAt,
      createdAt: tuple.createdAt,
      publishedAt: tuple.publishedAt,
      newsBodyList: Array<NewsBody>(),
      commentsCount: tuple.commentsCount,
    }
    const newsTupleWithAuthorData = {
      ...newsTuple,
      authorData: {
        isLegalPerson: tuple.authorIsLegalPerson,
        firstName: tuple.authorFirstName,
        lastName: tuple.authorLastName,
        shortName: tuple.authorShortName,
        avatar: tuple.authorAvatar,
        bio: tuple.authorBio,
        email: tuple.authorEmail,
      },
    }
    const authorDataRequired = !!tuple.authorFirstName
    return authorDataRequired ? newsTupleWithAuthorData : newsTuple
  }

  public static constructNewsFromMutableDTO(dto: MutableNewsDTO): ObjectWithAuthorDataObject<News> {
    return Object.freeze({
      uid: dto.uid,
      alternativeLink: dto.alternativeLink,
      authorUID: dto.authorUID,
      theme: dto.theme,
      pollUID: dto.pollUID,
      status: dto.status,
      section: dto.section,
      headerImage: dto.headerImage,
      tags: dto.tags,
      wpID: dto.wpID,
      lastSyncAt: dto.lastSyncAt,
      createdAt: dto.createdAt,
      publishedAt: dto.publishedAt,
      authorData: dto.authorData,
      commentsCount: dto.commentsCount,
      // NOTE: as we use frozen NewsBody already, we will reuse it
      newsBodyList: List<NewsBody>(dto.newsBodyList),
    })
  }

  public static constructNewsBodyFromTuple(newsTuple: NewsDBTuple): NewsBody {
    return Object.freeze({
      uid: newsTuple.bodyUid,
      seoTitle: newsTuple.seoTitle,
      seoDescription: newsTuple.seoDescription,
      title: newsTuple.title,
      shortDescription: newsTuple.shortDescription,
      body: newsTuple.body,
      language: newsTuple.language,
      newsUID: newsTuple.newsUID,
    })
  }

  public static getEmptyThemedNews(): ThemedNews {
    return {
      [NewsTheme.POLITICAL_MAP]: [],
      [NewsTheme.ECONOMY]: [],
      [NewsTheme.PUBLIC_INTEREST]: [],
      [NewsTheme.SCIENCE_AND_EDUCATION]: [],
      [NewsTheme.CULTURAL_SPACE]: [],
    }
  }

  public static constructThemedNewsGroups(themedNews: Array<News>): ThemedNews {
    const emptyThemedNews = NewsDTOHelper.getEmptyThemedNews()
    const themedNewsGroupObject = themedNews.reduce<ThemedNews>((acc: ThemedNews, curr: News) => {
      if (curr.theme && curr.theme in acc) {
        acc[curr.theme].push(curr)
      }
      return acc
    }, emptyThemedNews)
    return themedNewsGroupObject
  }
}
