import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { AuthController } from './controllers/auth/AuthController'
import { BannersController } from './controllers/banners/BannersController'
import { CommentController } from './controllers/comment/CommentController'
import { СompetencyTagController } from './controllers/competencyTag/СompetencyTagController'
import { DashboardController } from './controllers/dashboard/DashboardController'
import { IssueController } from './controllers/issue/IssueController'
import { ImageController } from './controllers/media/image/ImageController'
import { ModerationController } from './controllers/moderation/ModerationController'
import { NewsController } from './controllers/news/NewsController'
import { NotificationController } from './controllers/notification/NotificationController'
import { PollController } from './controllers/polls/PollController'
import { PollWatchController } from './controllers/pollWatch/PollWatchController'
import { MyProfileController } from './controllers/profiles/MyProfileController'
import { ProfileController } from './controllers/profiles/ProfileController'
import { TagController } from './controllers/tag/TagController'

export class RouterModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('AuthController', AuthController)
    container.registerSingleton('PollController', PollController)
    container.registerSingleton('ProfileController', ProfileController)
    container.registerSingleton('ImageController', ImageController)
    container.registerSingleton('ModerationController', ModerationController)
    container.registerSingleton('CommentController', CommentController)
    container.registerSingleton('MyProfileController', MyProfileController)
    container.registerSingleton('TagController', TagController)
    container.registerSingleton('СompetencyTagController', СompetencyTagController)
    container.registerSingleton('DashboardController', DashboardController)
    container.registerSingleton('NewsController', NewsController)
    container.registerSingleton('NotificationController', NotificationController)
    container.registerSingleton('IssueController', IssueController)
    container.registerSingleton('BannersController', BannersController)
    container.registerSingleton('PollWatchController', PollWatchController)

    logger.debug('app.context.router.module.initialized')
  }
}
