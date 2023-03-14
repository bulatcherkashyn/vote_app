import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { validate } from '../../../common/validators/ValidationMiddleware'
import { logger } from '../../../logger/LoggerFactory'
import { NewsService } from '../../../news/services/NewsService'
import { NewsQueryListValidator } from '../../../news/validator/NewsQueryListValidator'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'
import { NewsListFilterConstructor } from './NewsListFilterConstructor'

@injectable()
export class NewsController implements Controller {
  private listModelConstructor = new NewsListFilterConstructor()
  private listValidator = new NewsQueryListValidator()

  constructor(@inject('NewsService') private newsService: NewsService) {}

  public path(): string {
    return '/news'
  }

  public initialize(router: Router): void {
    router.get(
      '/',
      verifyAccess('list_news'),
      validate(this.listModelConstructor, this.listValidator),
      this.list,
    )

    router.get('/:newsLink', verifyAccess('get_news_by_uid'), this.get)
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('news.controller.filtered-list.start')

    const queryParams = this.listModelConstructor.constructPureObject(request)
    const news = await this.newsService.list(queryParams, request.accessRules)

    response.json(news)
    logger.debug('news.controller.filtered-list.done')
  }

  public get = async (request: Request, response: Response): Promise<void> => {
    logger.debug('news.controller.get.start')

    const { newsLink } = request.params
    const news = await this.newsService.getByUIDOrAlternativeLink(newsLink)

    response.json(news)

    logger.debug('news.controller.get.done')
  }
}
