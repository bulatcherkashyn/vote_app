import { BannerModule } from './iviche/banner/BannerModule'
import { CommentModule } from './iviche/comment/CommentModule'
import { CompetencyTagModule } from './iviche/competencyTag/CompetencyTagModule'
import { DashboardModule } from './iviche/dashboard/DashboardModule'
import { DBModule } from './iviche/db/DBModule'
import { ElasticModule } from './iviche/elastic/ElasticModule'
import { IndexTaskQueueModule } from './iviche/indexTaskQueue/IndexTaskQueueModule'
import { IssueModule } from './iviche/issue/IssueModule'
import { LocationModule } from './iviche/location/LocationModule'
import { logger } from './iviche/logger/LoggerFactory'
import { LoggerModule } from './iviche/logger/LoggerModule'
import { MailerModule } from './iviche/mailer/MailerModule'
import { ImageModule } from './iviche/media/image/ImageModule'
import { ModerationModule } from './iviche/moderation/ModerationModule'
import { NewsModule } from './iviche/news/NewsModule'
import { NotificationModule } from './iviche/notification/NotificationModule'
import { NotificationStorageModule } from './iviche/notificationStorage/NotificationStorageModule'
import { PersonModule } from './iviche/person/PersonModule'
import { PollModule } from './iviche/polls/PollModule'
import { PollWatchModule } from './iviche/pollWatch/PollWatchModule'
import { ProfileModule } from './iviche/profiles/ProfileModule'
import { PushNotificationModule } from './iviche/pushNotification/PushNotificationModule'
import { RatingMonitorModule } from './iviche/ratingMonitor/RatingMonitorModule'
import { RouterModule } from './iviche/routes/RouterModule'
import { SchedulerModule } from './iviche/scheduler/SchedulerModule'
import { AuthModule } from './iviche/security/auth/AuthModule'
import { TagModule } from './iviche/tag/TagModule'
import { TelegramBotModule } from './iviche/telegram-bot/TelegramBotModule'
import { UserModule } from './iviche/users/UserModule'
import { VoteModule } from './iviche/voting/VotingModule'

export class AppContext {
  static async initialize(): Promise<void> {
    await LoggerModule.initialize()
    await DBModule.initialize()
    await ElasticModule.initialize()
    await MailerModule.initialize()
    await AuthModule.initialize()
    await UserModule.initialize()
    await ImageModule.initialize()
    await VoteModule.initialize()
    await PersonModule.initialize()
    await PollModule.initialize()
    await LocationModule.initialize()
    await RouterModule.initialize()
    await ProfileModule.initialize()
    await SchedulerModule.initialize()
    await NotificationModule.initialize()
    await ModerationModule.initialize()
    await CommentModule.initialize()
    await TagModule.initialize()
    await CompetencyTagModule.initialize()
    await IndexTaskQueueModule.initialize()
    await NotificationStorageModule.initialize()
    await VoteModule.initialize()
    await NewsModule.initialize()
    await DashboardModule.initialize()
    await TelegramBotModule.initialize()
    await IssueModule.initialize()
    await PushNotificationModule.initialize()
    await BannerModule.initialize()
    await PollWatchModule.initialize()
    await RatingMonitorModule.initialize()

    logger.info('app.context.initialized')
  }
}
