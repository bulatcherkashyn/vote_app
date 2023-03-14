import express from 'express'
import { List } from 'immutable'
import { container } from 'tsyringe'

import { EnvironmentMode } from '../common/EnvironmentMode'
import { Controller } from './controllers/Controller'

export class Router {
  private readonly controllers: List<Controller>

  constructor() {
    this.controllers = List<Controller>([
      container.resolve<Controller>('AuthController'),
      container.resolve<Controller>('PollController'),
      container.resolve<Controller>('ProfileController'),
      container.resolve<Controller>('ImageController'),
      container.resolve<Controller>('ModerationController'),
      container.resolve<Controller>('CommentController'),
      container.resolve<Controller>('MyProfileController'),
      container.resolve<Controller>('TagController'),
      container.resolve<Controller>('СompetencyTagController'),
      container.resolve<Controller>('DashboardController'),
      container.resolve<Controller>('NewsController'),
      container.resolve<Controller>('NotificationController'),
      container.resolve<Controller>('IssueController'),
      container.resolve<Controller>('BannersController'),
      container.resolve<Controller>('PollWatchController'),
    ])
  }

  public mountRoutes(app: express.Application): void {
    let prefix = '/'

    if (!EnvironmentMode.isTest()) {
      prefix = '/api'
    }

    const router = express.Router()
    router.get('/', (req: express.Request, res: express.Response) => {
      res.json({
        message: 'iViche Server!',
      })
    })
    app.use(prefix, router)

    this.controllers.forEach((c: Controller) => {
      const router = express.Router()
      c.initialize(router)
      const path = prefix === '/' ? c.path() : prefix + c.path()
      app.use(path, router)
    })
  }
}
