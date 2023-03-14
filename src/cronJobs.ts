import express from 'express'
import http from 'http'

import { logger } from './iviche/logger/LoggerFactory'
import { SchedulerRegistryImpl } from './iviche/scheduler/SchedulerRegistryImpl'
import { ChildProcessHandler } from './iviche/scheduler/utility/ChildProcessHandler'

const schedulerRegistry = new SchedulerRegistryImpl()

schedulerRegistry.initialize()
logger.info(`cron-jobs.start.successful`)

const cronJobPort = (process.env.CRON_JOB_PORT && +process.env.CRON_JOB_PORT) || 1338
const app = express()

app.get('/wp-ping', (req, res) => {
  ChildProcessHandler.runScript('startSaveNewsFromWp', 'save-news-from-wp.job')
  res.send()
})

const server = http.createServer(app)

server.listen(cronJobPort, () => {
  logger.info(`cron-jobs.server.start.successful.on:${cronJobPort}`)
})
