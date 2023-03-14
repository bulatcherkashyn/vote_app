import { container } from 'tsyringe'

import { TelegramBotService } from '../../../src/iviche/telegram-bot/TelegramBotService'

class MockTelegramBotServiceImpl implements TelegramBotService {
  public async notifyModerators(): Promise<void> {
    return
  }
}

export class MockTelegramBotModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('TelegramBotService', MockTelegramBotServiceImpl)
  }
}
