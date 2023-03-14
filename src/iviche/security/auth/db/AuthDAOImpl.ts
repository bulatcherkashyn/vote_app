import { createHash } from 'crypto'

import { DateUtility } from '../../../common/utils/DateUtility'
import { TrxProvider } from '../../../db/TrxProvider'
import { logger } from '../../../logger/LoggerFactory'
import { AuthData } from '../models/AuthData'
import { HeaderInfo } from '../models/HeaderInfo'
import { NotificationAuthData } from '../models/NotificationAuthData'
import { AuthDAO } from './AuthDAO'

export class AuthDAOImpl implements AuthDAO {
  public static async deleteByUsername(trxProvider: TrxProvider, username: string): Promise<void> {
    logger.debug('auth.dao.delete-by-username.start')
    const trx = await trxProvider()

    await trx('auth_data')
      .where({ username })
      .delete()

    logger.debug('auth.dao.delete-by-username.done')
  }
  private readonly HASHING_ALGORITHM = 'sha512'

  private readonly MAX_SESSION_NUMBER = 5
  private readonly MOBILE_MAX_SESSION_NUMBER = 10

  private readonly HASH_ENCODING = 'base64'

  public async deleteUserSessionsByDeviceID(
    trxProvider: TrxProvider,
    authData: AuthData,
  ): Promise<void> {
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-id.start.for-device-id: [${authData?.deviceID}]`,
    )
    const trx = await trxProvider()
    const { deviceID } = authData
    const numberOfDeletedSessions = await trx<AuthData>('auth_data')
      .where('deviceID', deviceID)
      .del()
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-id.number-of-deleted-sessions: [${numberOfDeletedSessions}]`,
    )
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-id.done.for-device-id: [${authData?.deviceID}]`,
    )
  }
  public async deleteUserSessionsByDeviceToken(
    trxProvider: TrxProvider,
    authData: AuthData,
  ): Promise<void> {
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-token-hash.start.for-user: [${authData?.username}]`,
    )
    const trx = await trxProvider()
    const { headerInfo: authHeaderInfo, username } = authData

    const deviceToken = this.getDeviceTokenHash(username, authHeaderInfo)
    const numberOfDeletedSessions = await trx<AuthData>('auth_data')
      .where('deviceToken', deviceToken)
      .del()
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-token-hash.number-of-deleted-sessions: [${numberOfDeletedSessions}]`,
    )
    logger.debug(
      `auth.dao.delete-user-sessions-by-device-token-hash.done.for-user: [${authData?.username}]`,
    )
  }

  public async createSession(trxProvider: TrxProvider, authData: AuthData): Promise<void> {
    logger.debug(`auth.dao.create-session.start.for-username: [${authData?.username}]`)
    const trx = await trxProvider()
    const { headerInfo: authHeaderInfo, username, firebaseDeviceToken, deviceID } = authData

    const headerInfo = {
      ip: authHeaderInfo.ip,
      userAgent: authHeaderInfo.userAgent.ua,
    }
    const deviceToken = this.getDeviceTokenHash(username, authHeaderInfo)
    await trx('auth_data').insert({
      ...authData,
      headerInfo,
      firebaseDeviceToken,
      deviceToken,
      deviceID,
      createdAt: DateUtility.now(),
    })
    logger.debug(`auth.dao.create-session.done.for-username: [${authData?.username}]`)
  }

  private getDeviceTokenHash(username: string, headerInfo: HeaderInfo): string {
    logger.debug(`auth.dao.get-device-token-hash.start.for-username: [${username}]`)
    const footPrint = username + headerInfo.ip + headerInfo.userAgent.ua
    logger.debug(`auth.dao.get-device-token-hash.done.for-username: [${username}]`)
    return createHash(this.HASHING_ALGORITHM)
      .update(footPrint)
      .digest(this.HASH_ENCODING)
  }

  public async dropExceedingMobileSessionsIfAny(
    trxProvider: TrxProvider,
    username: string,
  ): Promise<void> {
    logger.debug(`auth.dao.drop-exceeding-mobile-sessions-if-any.start.for-username: [${username}]`)
    const trx = await trxProvider()
    const maxSession = this.MOBILE_MAX_SESSION_NUMBER
    const numberOfDeletedSessions = await trx<AuthData>('auth_data')
      .whereIn('username', function() {
        return this.from('auth_data')
          .select('username')
          .where({ username })
          .whereNotNull('deviceID')
          .groupBy('username')
          .having(trx.raw(`count(*) >= ${maxSession}`))
      })
      .del()
    logger.debug(
      `auth.dao.drop-exceeding-mobile-sessions-if-any.number-of-deleted-sessions: [${numberOfDeletedSessions}]`,
    )
    logger.debug(`auth.dao.drop-exceeding-mobile-sessions-if-any.done.for-username: [${username}]`)
  }

  public async dropExceedingSessionsIfAny(
    trxProvider: TrxProvider,
    username: string,
  ): Promise<void> {
    logger.debug(`auth.dao.drop-exceeding-sessions-if-any.start.for-username: [${username}]`)
    const trx = await trxProvider()
    const maxSession = this.MAX_SESSION_NUMBER
    const numberOfDeletedSessions = await trx<AuthData>('auth_data')
      .whereIn('username', function() {
        return this.from('auth_data')
          .select('username')
          .where({ username })
          .where({ deviceID: null })
          .groupBy('username')
          .having(trx.raw(`count(*) >= ${maxSession}`))
      })
      .del()
    logger.debug(
      `auth.dao.drop-exceeding-sessions-if-any.number-of-deleted-sessions: [${numberOfDeletedSessions}]`,
    )
    logger.debug(`auth.dao.drop-exceeding-sessions-if-any.done.for-username: [${username}]`)
  }

  public async get(trxProvider: TrxProvider, uid: string): Promise<AuthData | undefined> {
    logger.debug(`auth.dao.get-by-refresh-token.start.for-token: [${uid}]`)
    const trx = await trxProvider()
    const data = await trx<AuthData>('auth_data')
      .where({ uid })
      .first()
    logger.debug(`auth.dao.get-by-refresh-token.done.for-token: [${uid}]`)
    return data
  }

  public async delete(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug(`auth.dao.delete-by-refresh-token.start.for-token: [${uid}]`)
    const trx = await trxProvider()
    await trx<AuthData>('auth_data')
      .where({ uid })
      .del()
    logger.debug(`auth.dao.delete-by-refresh-token.done.for-token: [${uid}]`)
  }

  public async removeAuthSession(
    trxProvider: TrxProvider,
    refreshTokenHash: string,
  ): Promise<void> {
    logger.debug(
      `auth.dao.remove-auth-session-by-refresh-token-hash.start.for-hash: [${refreshTokenHash}]`,
    )
    const trx = await trxProvider()
    await trx<AuthData>('auth_data')
      .where({ refreshTokenHash })
      .del()
    logger.debug(
      `auth.dao.remove-auth-session-by-refresh-token-hash.done.for-hash: [${refreshTokenHash}]`,
    )
  }

  public async getFirebaseDeviceTokens(
    trxProvider: TrxProvider,
    userUIDs: Array<string>,
  ): Promise<Array<NotificationAuthData>> {
    const trx = await trxProvider()

    const result = await trx('users')
      .select(
        'users.uid as userUid',
        'auth_data.username as username',
        'auth_data.firebaseDeviceToken as firebaseDeviceToken',
      )
      .max('auth_data.createdAt as createdAt')
      .innerJoin('auth_data', 'auth_data.username', 'users.username')
      .whereNotNull('auth_data.firebaseDeviceToken')
      .whereIn('users.uid', userUIDs)
      .groupBy('auth_data.username')
      .groupBy('auth_data.firebaseDeviceToken')
      .groupBy('users.uid')

    return result as Array<NotificationAuthData>
  }

  public async getTokenDataForNewPollNotification(
    trxProvider: TrxProvider,
  ): Promise<Array<NotificationAuthData>> {
    const trx = await trxProvider()
    const result = await trx('users')
      .select(
        'users.uid as userUid',
        'auth_data.username as username',
        'auth_data.firebaseDeviceToken as firebaseDeviceToken',
      )
      .whereNotNull('auth_data.firebaseDeviceToken')
      .max('auth_data.createdAt as createdAt')
      .innerJoin('auth_data', 'auth_data.username', 'users.username')
      .whereIn(
        'users.uid',
        trx('user_details')
          .select('user_details.uid')
          .where('user_details.notifyAboutNewPoll', true),
      )
      .groupBy('users.uid')
      .groupBy('auth_data.username')
      .groupBy('auth_data.firebaseDeviceToken')

    return result as Array<NotificationAuthData>
  }
}
