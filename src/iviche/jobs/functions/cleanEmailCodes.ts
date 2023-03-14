import 'reflect-metadata'

import * as Knex from 'knex'

import { EnvironmentMode } from '../../common/EnvironmentMode'
import { logger } from '../../logger/LoggerFactory'

// NOTE: export is required for testing with the ability to provide a mock database connection
export const cleanExpiredEmailConfirmationCodes = async (knexConnection: Knex): Promise<void> => {
  const PROCESS_EXIT_ERROR = -322
  try {
    const result = await knexConnection('user_details')
      .update({ emailConfirmationCode: null })
      .whereNotNull('emailConfirmationCode')
      .whereRaw('date_part(\'day\', now() - "emailConfirmationCodeCreatedAt") >= 1')

    logger.debug(`expired-email-confirmation-codes-cleaner.job.result:[${result}]`)
  } catch (error) {
    knexConnection.destroy()
    logger.error(`expired-email-confirmation-codes-cleaner.job.error:`, error)
    if (!EnvironmentMode.isTest()) {
      process.exit(PROCESS_EXIT_ERROR)
    }
  }

  knexConnection.destroy()
}
