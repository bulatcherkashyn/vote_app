import { Request, Response, Router } from 'express'
import requestIp from 'request-ip'
import { ApiOperationPost, ApiPath } from 'swagger-express-ts'
import { inject, injectable } from 'tsyringe'
import { UAParser } from 'ua-parser-js'

import { cookieConfig } from '../../../../../config/cookieConfig'
import { validate } from '../../../common/validators/ValidationMiddleware'
import { logger } from '../../../logger/LoggerFactory'
import { HeaderInfo } from '../../../security/auth/models/HeaderInfo'
import { AuthService } from '../../../security/auth/services/AuthService'
import { UserAuthFormValidator } from '../../../security/auth/validator/UserAuthFormValidator'
import { UserLoginVia3dPartyValidator } from '../../../security/auth/validator/UserLoginVia3dPartyValidator'
import { Controller } from '../Controller'
import { ProfileModelConstructor } from '../profiles/ProfileModelConstructor'
import { LoginDirectEndpointRequest, LoginDirectEndpointResponse } from './AuthDataConstructors'
import { Login3dPartyConstructor } from './Login3dPartyConstructor'
import { UserAuthFormModelConstructor } from './UserAuthFormModelConstructor'
@ApiPath({
  name: 'Authorization',
  path: '/auth',
})
@injectable()
export class AuthController implements Controller {
  private login3dPartyModelConstructor = new Login3dPartyConstructor()
  private userAuthFormModelConstructor = new UserAuthFormModelConstructor()
  private userAuthFromValidator = new UserAuthFormValidator()
  private login3dPartyValidator = new UserLoginVia3dPartyValidator()
  private profileModelConstructor = new ProfileModelConstructor()
  constructor(
    @inject('AuthService')
    private authService: AuthService,
  ) {}

  public path(): string {
    return '/auth'
  }

  public initialize(router: Router): void {
    router.post(
      '/registration',
      validate(this.userAuthFormModelConstructor, this.userAuthFromValidator),
      this.registerUser,
    )
    router.post(
      '/login/direct',
      validate(this.userAuthFormModelConstructor, this.userAuthFromValidator),
      this.login.bind(this),
    )
    router.post(
      '/login/google',
      validate(this.login3dPartyModelConstructor, this.login3dPartyValidator),
      this.loginGoogle,
    )

    router.post(
      '/login/facebook',
      validate(this.login3dPartyModelConstructor, this.login3dPartyValidator),
      this.loginFacebook,
    )

    router.post(
      '/login/apple',
      validate(this.login3dPartyModelConstructor, this.login3dPartyValidator),
      this.loginApple,
    )

    router.post('/refresh', this.refresh)
    router.post('/logout', this.logout)
  }

  public registerUser = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.user-registration.start')
    const profile = this.profileModelConstructor.constructUserRegistrationProfile(request)
    const { language } = request.query

    await this.authService.registerUser(profile, language)

    response.status(201).send()
    logger.debug('auth.controller.user-registration.done')
  }

  @ApiOperationPost({
    description: 'Direct login with user credentials',
    path: '/login/direct',
    parameters: {
      body: {
        description: 'Direct login body.',
        model: LoginDirectEndpointRequest.name,
        required: true,
      },
    },
    responses: {
      [LoginDirectEndpointResponse.successStatusCode]: {
        model: LoginDirectEndpointResponse.name,
      },
    },
    summary: 'Direct login with user credentials',
  })
  public async login(request: Request, response: Response): Promise<void> {
    logger.debug('auth.controller.login.start')
    const {
      username,
      password,
      headerInfo,
      firebaseDeviceToken,
      deviceID,
    } = new LoginDirectEndpointRequest(request)

    const { authToken, refreshToken } = await this.authService.login(
      username,
      password,
      headerInfo,
      firebaseDeviceToken,
      deviceID,
    )

    response.cookie('token', authToken, cookieConfig)
    response
      .status(LoginDirectEndpointResponse.successStatusCode)
      .json(new LoginDirectEndpointResponse(refreshToken.token))
    logger.debug('auth.controller.login.done')
  }

  public loginGoogle = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.login-google.start')
    const { token, firebaseDeviceToken, deviceID } = request.body
    const { language } = request.query
    const headerInfo = this.getHeaderInfo(request)

    const { authToken, refreshToken, isNew } = await this.authService.loginGoogle(
      token,
      headerInfo,
      language,
      firebaseDeviceToken,
      deviceID,
    )

    response.cookie('token', authToken, cookieConfig)
    response.status(200).json({ refreshToken: refreshToken.token, isNew })
    logger.debug('auth.controller.login-google.done')
  }

  public loginFacebook = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.login-facebook.start')
    const { token, firebaseDeviceToken, deviceID } = request.body
    const { language } = request.query
    const headerInfo = this.getHeaderInfo(request)

    const { authToken, refreshToken, isNew } = await this.authService.loginFacebook(
      token,
      headerInfo,
      language,
      firebaseDeviceToken,
      deviceID,
    )

    response.cookie('token', authToken, cookieConfig)
    response.status(200).json({ refreshToken: refreshToken.token, isNew })
    logger.debug('auth.controller.login-facebook.done')
  }

  public loginApple = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.login-apple.start')
    // TODO: parse token instead, now clients scope doesn't effect the contents of the token (apple doesn't provide such info in a token)
    const { token, user, firebaseDeviceToken, deviceID } = request.body
    const { language } = request.query
    const headerInfo = this.getHeaderInfo(request)

    const { authToken, refreshToken, isNew } = await this.authService.loginApple(
      token,
      headerInfo,
      language,
      firebaseDeviceToken,
      user,
      deviceID,
    )

    response.cookie('token', authToken, cookieConfig)
    response.status(200).json({ refreshToken: refreshToken.token, isNew })
    logger.debug('auth.controller.login-apple.done')
  }

  // NOTE: Probably it will work a little bit faster with REDIS 🚀
  public refresh = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.refresh.start')
    const { refreshToken, deviceID } = request.body
    const headerInfo = this.getHeaderInfo(request)
    const tokens = await this.authService.refreshAuthTokens(refreshToken, headerInfo, deviceID)

    response.cookie('token', tokens.authToken, cookieConfig)
    response.status(200).json({ refreshToken: tokens.refreshToken.token })
    logger.debug('auth.controller.refresh.done')
  }

  public logout = async (request: Request, response: Response): Promise<void> => {
    logger.debug('auth.controller.logout.start')
    const { refreshToken, deviceID } = request.body
    const headerInfo = this.getHeaderInfo(request)

    await this.authService.removeAuthSession(headerInfo, refreshToken, deviceID)

    response.clearCookie('token')
    response.status(204).send()
    logger.debug('auth.controller.logout.done')
  }

  private getHeaderInfo(request: Request): HeaderInfo {
    return {
      ip: requestIp.getClientIp(request) as string,
      userAgent: new UAParser(request.headers['user-agent'] as string).getResult(),
    }
  }
}
