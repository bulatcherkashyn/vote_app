import { Telegram } from 'telegraf'
import { injectable } from 'tsyringe'

import { serverURL } from '../../../config/serverURLConfig'
import { logger } from '../logger/LoggerFactory'
import { TelegramBotService } from './TelegramBotService'

@injectable()
export class TelegramBotServiceImpl implements TelegramBotService {
  private BOT_API_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
  private CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || ''

  private telegram: Telegram

  private NEW_MODERATION_MESSAGE_TEMPLATE = `The moderation list has been updated, please <a href="${serverURL}/app/moderation-cases">check</a>`

  private async sendMessage(messageHTML: string): Promise<void> {
    await this.telegram.sendMessage(
      this.CHANNEL_ID,
      messageHTML,
      { parse_mode: 'HTML' }, // eslint-disable-line @typescript-eslint/camelcase
    )
  }

  constructor() {
    this.telegram = new Telegram(this.BOT_API_TOKEN)
  }

  public async notifyModerators(): Promise<void> {
    logger.debug('telegram-bot-service.send-message')
    await this.sendMessage(this.NEW_MODERATION_MESSAGE_TEMPLATE)
  }
}
