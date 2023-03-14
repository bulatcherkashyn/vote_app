import 'express-async-errors'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Application, NextFunction, Request, Response } from 'express'
import * as swagger from 'swagger-express-ts'

import { EnvironmentMode } from './iviche/common/EnvironmentMode'
import { finalErrorHandler } from './iviche/common/express/ErrorHandler'
import { LoggerFactory } from './iviche/logger/LoggerFactory'
import { Router } from './iviche/routes/Router'

export class App {
  private static setupContentTypePolicy(req: Request, res: Response, next: NextFunction): void {
    res.header('Content-Type', 'application/json;charset=utf-8')
    res.header('Accept', 'application/json;charset=utf-8')
    next()
  }

  private readonly express: Application

  constructor() {
    this.express = express()

    this.initializeMiddleware()
    this.initializeRoutes()
    this.initializeFinalErrorHandler()
  }

  private initializeMiddleware(): void {
    // Swagger documentation
    if (EnvironmentMode.isDevelopment()) {
      this.express.use('/api-docs/swagger', express.static('swagger'))
      this.express.use('/api-docs/swagger/assets', express.static('node_modules/swagger-ui-dist'))
      this.express.use(
        swagger.express({
          definition: {
            info: {
              title: 'iViche API',
              version: '1.0',
            },
            basePath: '/api',
            externalDocs: {
              url: '/api',
            },
          },
        }),
      )
    }
    this.express.use(
      cors({
        origin: '*',
        methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
        exposedHeaders: ['Authorization', 'Content-Type'],
      }),
    )
    this.express.use(App.setupContentTypePolicy)
    this.express.use(cookieParser())
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(LoggerFactory.getExpressLogger())
  }

  private initializeRoutes(): void {
    const router = new Router()
    router.mountRoutes(this.express)
  }

  private initializeFinalErrorHandler(): void {
    this.express.use(finalErrorHandler)
  }

  get application(): express.Application {
    return this.express
  }
}
