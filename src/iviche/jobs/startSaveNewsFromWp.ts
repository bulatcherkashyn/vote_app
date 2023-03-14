import 'reflect-metadata'

import axios, { AxiosResponse } from 'axios'

import { DBConnection } from '../db/DBConnection'
import { logger } from '../logger/LoggerFactory'
import { saveNewsFromWp } from './functions/saveNewsFromWp'

async function startSaveNewsFromWp(): Promise<void> {
  try {
    const request: AxiosResponse = await axios.get(`${process.env.WP_URL}?forLastDays=0`)

    if (request.status !== 200) {
      logger.error(`save-news-from-wp.job.api.error[request.status:${request.status}]`)
      return
    }
    await saveNewsFromWp(new DBConnection().getConnection())
  } catch (e) {
    logger.error(`save-news-from-wp.job.api.axios.error`, e)
  }
}

startSaveNewsFromWp()
