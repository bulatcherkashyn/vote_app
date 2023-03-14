import { Request, Response, Router } from 'express'
import { inject, injectable } from 'tsyringe'

import { logger } from '../../../logger/LoggerFactory'
import { NotificationStorageService } from '../../../notificationStorage/services/NotificationStorageService'
import { verifyAccess } from '../../../security/acs/ACSMiddleware'
import { Controller } from '../Controller'

@injectable()
export class NotificationController implements Controller {
  constructor(
    @inject('NotificationStorageService')
    private noficationStorageService: NotificationStorageService,
  ) {}

  public path(): string {
    return '/notifications'
  }

  public initialize(router: Router): void {
    router.get('/', verifyAccess('notification_list'), this.list)
    router.put('/markAsRead', verifyAccess('update_notification'), this.markAsRead)
  }

  public list = async (request: Request, response: Response): Promise<void> => {
    logger.debug('notification.controller.list.start')
    const uid = request.user?.uid as string

    const result = await this.noficationStorageService.search(uid, 1000)

    response.json(result)
    logger.debug('notification.controller.list.done')
  }

  public markAsRead = async (request: Request, response: Response): Promise<void> => {
    logger.debug('notification.controller.mark-as-read.start')
    const userUID = request.user?.uid as string
    const UIDs = request.query.uids?.split(',')

    await this.noficationStorageService.markAsRead(userUID, UIDs)

    response.send()
    logger.debug('notification.controller.mark-as-read.done')
  }
}
