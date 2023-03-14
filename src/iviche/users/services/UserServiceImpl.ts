import * as Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { TrxUtility } from '../../db/TrxUtility'
import { GenericServiceImpl } from '../../generic/service/GenericServiceImpl'
import { logger } from '../../logger/LoggerFactory'
import { UserDAO } from '../db/UserDAO'
import { User } from '../models/User'
import { UserService } from './UserService'

@injectable()
export class UserServiceImpl extends GenericServiceImpl<User, UserDAO> implements UserService {
  constructor(@inject('UserDAO') dao: UserDAO, @inject('DBConnection') db: Knex) {
    super(dao, db)
  }
  public async findUser(username: string): Promise<User | undefined> {
    logger.debug(`user.service.find-by-email.start.for-username: [${username}]`)
    return TrxUtility.transactional<User | undefined>(this.db, async trxProvider => {
      const user = await this.dao.findUser(trxProvider, username)
      logger.debug(`user.service.find-by-email.done.for-username: [${username}]`)
      return user
    })
  }

  public async findByGoogleId(googleId: string): Promise<User | undefined> {
    logger.debug(`user.service.find-by-googleId.start.for-googleId: [${googleId}]`)
    return TrxUtility.transactional<User | undefined>(this.db, async trxProvider => {
      const user = await this.dao.findUserByGoogleId(trxProvider, googleId)
      logger.debug(`user.service.find-by-googleId.done.for-googleId: [${googleId}]`)
      return user
    })
  }

  public async findByFacebookId(facebookId: string): Promise<User | undefined> {
    logger.debug(`user.service.find-by-facebookId.start.for-facebookId: [${facebookId}]`)
    return TrxUtility.transactional<User | undefined>(this.db, async trxProvider => {
      const user = await this.dao.findUserByFacebookId(trxProvider, facebookId)
      logger.debug(`user.service.find-by-facebookId.done.for-facebookId: [${facebookId}]`)
      return user
    })
  }

  public async findByAppleId(appleId: string): Promise<User | undefined> {
    logger.debug(`user.service.find-by-appleId.start.for-appleId: [${appleId}]`)
    return TrxUtility.transactional<User | undefined>(this.db, async trxProvider => {
      const user = await this.dao.findUserByAppleId(trxProvider, appleId)
      logger.debug(`user.service.find-by-appleId.done.for-appleId: [${appleId}]`)
      return user
    })
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    logger.debug(`user.service.find-by-email.start.for-email: [${email}]`)
    return TrxUtility.transactional<User | undefined>(this.db, async trxProvider => {
      const user = await this.dao.findUserByEmail(trxProvider, email)
      logger.debug(`user.service.find-by-email.done.for-email: [${email}]`)
      return user
    })
  }

  public async updateUserLastLogin(username: string): Promise<void> {
    logger.debug('user.service.last-login-upd.start')
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      await this.dao.updateUserLastLogin(trxProvider, username)
      logger.debug('user.service.last-login-upd.done')
    })
  }
}
