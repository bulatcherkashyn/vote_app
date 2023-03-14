import 'reflect-metadata'

import { DBConnection } from '../db/DBConnection'
import { saveBannersFromWp } from './functions/saveBannersFromWP'

async function startSaveNewsFromWp(): Promise<void> {
  await saveBannersFromWp(new DBConnection().getConnection())
}

startSaveNewsFromWp()
