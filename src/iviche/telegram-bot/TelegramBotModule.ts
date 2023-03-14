import { container } from 'tsyringe'

import { logger } from '../logger/LoggerFactory'
import { TelegramBotServiceImpl } from './TelegramBotServiceImpl'

export class TelegramBotModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('TelegramBotService', TelegramBotServiceImpl)
    logger.debug('app.context.telegram-bot.module.initialized')
  }
}
