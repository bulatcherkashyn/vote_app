import { createHash } from 'crypto'
import Knex from 'knex'
import { inject, injectable } from 'tsyringe'

import { EnvironmentMode } from '../../../common/EnvironmentMode'
import { Language } from '../../../common/Language'
import { DateUtility } from '../../../common/utils/DateUtility'
import { TrxUtility } from '../../../db/TrxUtility'
import { ApplicationError } from '../../../error/ApplicationError'
import {
  AuthErrorCodes,
  ConflictErrorCodes,
  ForbiddenErrorCodes,
} from '../../../error/DetailErrorCodes'
import { ServerError } from '../../../error/ServerError'
import { logger } from '../../../logger/LoggerFactory'
import { EmailService } from '../../../mailer/EmailService'
import { Profile } from '../../../profiles/models/Profile'
import { ProfileService } from '../../../profiles/services/ProfileService'
import { ProfileModelConstructor } from '../../../routes/controllers/profiles/ProfileModelConstructor'
import { User } from '../../../users/models/User'
import { UserSystemStatus } from '../../../users/models/UserSystemStatus'
import { UserService } from '../../../users/services/UserService'
import { GrandAccessACS } from '../../acs/strategies'
import { AuthDAO } from '../db/AuthDAO'
import { AppleUser } from '../models/AppleData'
import { AuthData } from '../models/AuthData'
import { AuthTokens } from '../models/AuthTokens'
import { HeaderInfo } from '../models/HeaderInfo'
import { RefreshToken } from '../models/RefreshToken'
import { AuthProvider } from './AuthProvider'
import { AuthService } from './AuthService'

@injectable()
export class AuthServiceImpl implements AuthService {
  public static encryptPassword(password: string): string {
    if (!password) {
      throw new ApplicationError('Password is empty')
    }
    if (EnvironmentMode.isProduction()) {
      return createHash('sha512')
        .update(password)
        .digest('hex')
    }
    return `TEXT:${password}`
  }

  private static getRefreshTokenAgeInDays(createdAt: Date): number {
    return DateUtility.getDateDiff(createdAt, DateUtility.now(), ['days']).days as number
  }

  private readonly REFRESH_TOKEN_EXP_TIME = 60 // 60 days

  private profileModuleConstructor = new ProfileModelConstructor()

  constructor(
    @inject('UserService') private userService: UserService,
    @inject('AuthProvider')
    private authProvider: AuthProvider,
    @inject('ProfileService')
    private profileService: ProfileService,
    @inject('DBConnection') private db: Knex,
    @inject('AuthDAO') private authDao: AuthDAO,
    @inject('EmailService') private emailService: EmailService,
  ) {}

  public async verifyUserSystemStatus(user: User | undefined): Promise<void> {
    logger.debug(`auth.service.verify-user-system-status.start.for: [${user?.username}]`)

    if (user && user.systemStatus === UserSystemStatus.BANNED) {
      logger.debug(`auth.service.verify-username-password.unsuccessful.for: [${user?.username}]`)
      throw new ServerError('User banned', 403, ForbiddenErrorCodes.USER_BANNED, 'system-status')
    }

    logger.debug(`auth.service.verify-user-system-status.done.for: [${user?.username}]`)
  }

  public async verifyUsernamePassword(
    username: string,
    password: string,
    user: User | undefined,
    source: string,
  ): Promise<void> {
    logger.debug(`auth.service.verify-username-password.start.for-username: [${username}]`)

    if (!user || !(user.password === AuthServiceImpl.encryptPassword(password))) {
      logger.debug(`auth.service.verify-username-password.unsuccessful.for-username: [${username}]`)
      throw new ServerError(
        "Username/password don't match",
        401,
        AuthErrorCodes.DONT_MATCH_ERROR,
        source,
      )
    }
    logger.debug(`auth.service.verify-username-password.done.for-username: [${username}]`)
  }

  public async registerUser(profile: Profile, language: Language = Language.UA): Promise<void> {
    logger.debug('auth.service.register.start.for:', profile.user.username)

    await this.profileService.create(profile, new GrandAccessACS(), language, true)

    logger.debug(`auth.service.register.done.for:[${profile.user.username}]`)
  }

  public async login(
    username: string,
    password: string,
    headerInfo: HeaderInfo,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug(`auth.service.login.start.for-username: [${username}]`)

    const user = await this.userService.findByEmail(username)

    await this.verifyUserSystemStatus(user)
    await this.verifyUsernamePassword(username, password, user, 'login')

    logger.debug(`auth.service.login.done.for-username: [${username}]`)
    return this.createAuthTokens(user as User, headerInfo, firebaseDeviceToken, deviceID)
  }

  public async loginGoogle(
    token: string,
    headerInfo: HeaderInfo,
    language: Language = Language.UA,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug('auth.service.login-google.start')
    const tokenPayload = await this.authProvider.decodeGoogleToken(token)

    if (!tokenPayload.email_verified) {
      throw new ServerError(
        `Google email is not verified`,
        403,
        ForbiddenErrorCodes.EMAIL_IS_NOT_CONFIRMED,
        'google',
      )
    }

    let isNew = false
    let user = await this.userService.findByGoogleId(tokenPayload.sub)
    await this.verifyUserSystemStatus(user)

    if (!user) {
      const profile = this.profileModuleConstructor.constructGoogleProfile(
        tokenPayload.email as string,
        tokenPayload.sub,
        tokenPayload.email_verified,
        tokenPayload.given_name as string,
        tokenPayload.family_name as string,
      )

      let userUID
      try {
        userUID = await this.profileService.create(profile, new GrandAccessACS(), language)
      } catch (error) {
        this.processErrorAfterProfileCreation(error, 'google')
      }

      user = { ...profile.user, uid: userUID }
      this.emailService.sendConfirmEmailCodeIfNeeded(profile, language)
      isNew = true
    }

    const tokens = await this.createAuthTokens(user, headerInfo, firebaseDeviceToken, deviceID)
    logger.debug('auth.service.login-google.done')
    return { ...tokens, isNew }
  }

  public async loginApple(
    token: string,
    headerInfo: HeaderInfo,
    language: Language = Language.UA,
    firebaseDeviceToken?: string,
    userData?: AppleUser,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug('auth.service.login-apple.start')
    const tokenPayload = await this.authProvider.decodeAppleToken(token)

    if (!tokenPayload.emailVerified) {
      throw new ServerError(
        `Apple's email is not verified`,
        403,
        ForbiddenErrorCodes.EMAIL_IS_NOT_CONFIRMED,
        'apple',
      )
    }

    const appleId = tokenPayload.id as string
    let isNew = false
    let user = await this.userService.findByAppleId(appleId)
    await this.verifyUserSystemStatus(user)
    if (!user) {
      const profile = this.profileModuleConstructor.constructAppleProfile(tokenPayload, userData)
      let userUID

      try {
        userUID = await this.profileService.create(profile, new GrandAccessACS(), language)
      } catch (error) {
        this.processErrorAfterProfileCreation(error, 'apple')
      }

      user = { ...profile.user, uid: userUID }
      isNew = true
    }

    const tokens = await this.createAuthTokens(user, headerInfo, firebaseDeviceToken, deviceID)
    logger.debug('auth.service.login-apple.done')
    return { ...tokens, isNew }
  }

  public async loginFacebook(
    token: string,
    headerInfo: HeaderInfo,
    language: Language = Language.UA,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug('auth.service.login-facebook.start')
    const tokenPayload = await this.authProvider.decodeFacebookToken(token)

    if (!tokenPayload.email) {
      throw new ServerError(
        `Facebook's email is empty`,
        403,
        ForbiddenErrorCodes.NO_EMAIL_ON_FACEBOOK,
        'facebook',
      )
    }

    const facebookId = tokenPayload.id as string

    let isNew = false
    let user = await this.userService.findByFacebookId(facebookId)
    await this.verifyUserSystemStatus(user)
    if (!user) {
      const profile = this.profileModuleConstructor.constructFacebookProfile(tokenPayload)
      let userUID

      try {
        userUID = await this.profileService.create(profile, new GrandAccessACS(), language)
      } catch (error) {
        this.processErrorAfterProfileCreation(error, 'facebook')
      }

      user = { ...profile.user, uid: userUID }
      isNew = true
    }

    const tokens = await this.createAuthTokens(user, headerInfo, firebaseDeviceToken, deviceID)
    logger.debug('auth.service.login-facebook.done')
    return { ...tokens, isNew }
  }

  public async refreshAuthTokens(
    refreshToken: string,
    headerInfo: HeaderInfo,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug(`auth.service.refresh-auth-tokens.start.for-refresh-token: [${refreshToken}]`)

    return TrxUtility.transactional<AuthTokens>(this.db, async trxProvider => {
      if (!refreshToken) {
        logger.error(`auth.service.refresh-auth-tokens.unsuccessful.no-refresh-token`)
        throw new ServerError(
          'Refresh token not present',
          400,
          AuthErrorCodes.NO_REFRESH_TOKEN,
          'refresh-token',
        )
      }
      const authData = await this.authDao.get(trxProvider, refreshToken)
      let refreshTokenHash: string
      if (deviceID) {
        refreshTokenHash = this.authProvider.getMobileAppRefreshTokenHash(refreshToken, deviceID)
      } else {
        refreshTokenHash = this.authProvider.getWebClientRefreshTokenHash(refreshToken, headerInfo)
      }

      if (!authData) {
        logger.error(
          `auth.service.refresh-auth-tokens.unsuccessful.no-auth-data-by-refresh-token:[${refreshToken}]`,
        )
        throw new ServerError(
          'Authentication is not possible',
          400,
          AuthErrorCodes.AUTH_DATA_BY_REFRESH_TOKEN_NOT_FOUND,
          'refresh-token',
        )
      }
      if (authData.refreshTokenHash !== refreshTokenHash) {
        logger.error(
          `auth.service.refresh-auth-tokens.unsuccessful.refresh-token-[${refreshToken}]-issued-with-different-footprint`,
        )
        throw new ServerError(
          'Token refresh not allowed',
          400,
          AuthErrorCodes.REFRESH_TOKEN_DOESNT_MATCH,
          'refresh-token',
        )
      }
      // NOTE: It could be optimized
      const user = await this.userService.findUser(authData.username)
      const userUID = (user && user.uid) || ''
      const newAuthTokens = this.getTokens(userUID, headerInfo, deviceID)
      const tokenCreatedAt = authData.createdAt as Date

      const previousSession = await this.authDao.get(trxProvider, refreshToken)
      await this.authDao.delete(trxProvider, refreshToken)
      if (AuthServiceImpl.getRefreshTokenAgeInDays(tokenCreatedAt) > this.REFRESH_TOKEN_EXP_TIME) {
        ;(await trxProvider()).commit()
        throw new ServerError('RefreshToken has expired', 401)
      }

      await this.authDao.createSession(trxProvider, {
        uid: newAuthTokens.refreshToken.token,
        username: authData.username,
        headerInfo: headerInfo,
        deviceID: previousSession?.deviceID, // ???
        firebaseDeviceToken: previousSession?.firebaseDeviceToken, // ???
        refreshTokenHash: newAuthTokens.refreshToken.hash,
      })

      logger.debug(
        `auth.service.refresh-auth-tokens.done.for-refresh-token: [${refreshToken}], and username: [${authData?.username}]`,
      )
      return newAuthTokens
    })
  }

  public async validateAccessToken(authToken?: string): Promise<User> {
    logger.debug(`auth.service.validate-access-token.start.for-access-token: [${authToken}]`)

    if (!authToken) {
      throw new ServerError('No auth token', 401, AuthErrorCodes.NO_ACCESS_TOKEN, 'token')
    }

    const { userUID } = this.authProvider.decodeAuthToken(authToken)

    const user = await this.userService.get(userUID, new GrandAccessACS())

    if (!user) {
      logger.error('auth.service.validate-access-token.error.not-found')
      throw new ServerError('Incorrect access token', 401)
    }
    logger.debug(`auth.service.validate-access-token.done.for-access-token: [${authToken}]`)
    return user
  }

  public async removeAuthSession(
    headerInfo: HeaderInfo,
    refreshToken?: string,
    deviceID?: string,
  ): Promise<void> {
    logger.debug('auth.service.remove-auth-session.start')

    if (!refreshToken) {
      throw new ServerError(
        'No refreshToken',
        401,
        AuthErrorCodes.UNKNOWN_AUTH_ERROR,
        'refreshToken',
      )
    }
    return TrxUtility.transactional<void>(this.db, async trxProvider => {
      let refreshTokenHash: string
      if (deviceID) {
        refreshTokenHash = this.authProvider.getMobileAppRefreshTokenHash(refreshToken, deviceID)
      } else {
        refreshTokenHash = this.authProvider.getWebClientRefreshTokenHash(refreshToken, headerInfo)
      }

      await this.authDao.removeAuthSession(trxProvider, refreshTokenHash)
      logger.debug('auth.service.remove-auth-session.done')
    })
  }

  private async createAuthTokens(
    user: User,
    headerInfo: HeaderInfo,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens> {
    logger.debug(`auth.service.create-auth-tokens.start.for-username: [${user?.username}]`)
    const isMobileSession = !!deviceID
    const { username } = user
    const authTokens: AuthTokens = this.getTokens(user.uid as string, headerInfo, deviceID)
    const authData = {
      uid: authTokens.refreshToken.token,
      username,
      headerInfo,
      deviceID,
      firebaseDeviceToken,
      refreshTokenHash: authTokens.refreshToken.hash,
    }
    await this.revokeExistingSessions(authData, isMobileSession)
    logger.debug(`auth.service.create-auth-tokens.done.for-username: [${user?.username}]`)
    return TrxUtility.transactional<AuthTokens>(this.db, async trxProvider => {
      logger.debug(`auth.service.create-auth-tokens.start.transaction.for-username: [${username}]`)
      await this.authDao.dropExceedingMobileSessionsIfAny(trxProvider, username)
      await this.authDao.dropExceedingSessionsIfAny(trxProvider, username)

      await this.authDao.createSession(trxProvider, authData)

      logger.debug(`auth.service.create-auth-tokens.done.transaction.for-username: [${username}]`)

      return authTokens
    })
  }

  private async revokeExistingSessions(
    authData: AuthData,
    isMobileSession: boolean,
  ): Promise<void> {
    return TrxUtility.transactional(this.db, async trxProvider => {
      logger.debug('auth.service.revoke-existing-sessions.start')
      if (isMobileSession) {
        await this.authDao.deleteUserSessionsByDeviceID(trxProvider, authData)
      } else {
        await this.authDao.deleteUserSessionsByDeviceToken(trxProvider, authData)
      }
      logger.debug(`auth.service.revoke-existing-sessions.done`)
    })
  }

  private getTokens(userUID: string, headerInfo: HeaderInfo, deviceID?: string): AuthTokens {
    logger.debug(`auth.service.get-tokens.start.for-uid: [${userUID}]`)
    const authToken = this.authProvider.getAuthToken(userUID)
    const refreshToken: RefreshToken = this.authProvider.getRefreshToken(headerInfo, deviceID)

    logger.debug(
      `auth.service.get-tokens.done.for-uid: [${userUID}].\nAccess token: [${authToken}],\nRefresh token: [${refreshToken?.token}]`,
    )
    return { authToken, refreshToken }
  }

  private processErrorAfterProfileCreation(error: ServerError, source: string): Promise<void> {
    if (error.code === ConflictErrorCodes.EXIST_ERROR) {
      error.source = source
    }
    throw error
  }
}
