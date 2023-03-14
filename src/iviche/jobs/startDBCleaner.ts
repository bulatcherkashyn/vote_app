import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { cleanExpiredEmailConfirmationCodes } from './functions/cleanEmailCodes'
import { cleanExpiredPasswordRestorationCodes } from './functions/cleanPasswordRestorationCodes'

const dbConnection = new DBConnection().getConnection()

cleanExpiredEmailConfirmationCodes(dbConnection)

cleanExpiredPasswordRestorationCodes(dbConnection)
