import { Language } from '../../../common/Language'
import { Profile } from '../../../profiles/models/Profile'
import { User } from '../../../users/models/User'
import { AppleUser } from '../models/AppleData'
import { AuthTokens } from '../models/AuthTokens'
import { HeaderInfo } from '../models/HeaderInfo'

export interface AuthService {
  registerUser(profile: Profile, language?: Language): Promise<void>

  login(
    username: string,
    password: string,
    headerInfo: HeaderInfo,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens>

  validateAccessToken(authToken: string): Promise<User>

  refreshAuthTokens(
    refreshTokenJWT: string,
    headerInfo: HeaderInfo,
    deviceID?: string,
  ): Promise<AuthTokens>

  removeAuthSession(headerInfo: HeaderInfo, refreshToken?: string, deviceID?: string): Promise<void>

  loginGoogle(
    token: string,
    headerInfo: HeaderInfo,
    language: Language,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens>

  loginFacebook(
    token: string,
    headerInfo: HeaderInfo,
    language: Language,
    firebaseDeviceToken?: string,
    deviceID?: string,
  ): Promise<AuthTokens>

  loginApple(
    token: string,
    // TODO: parse token instead, now clients scope doesn't effect the contents of the token
    headerInfo: HeaderInfo,
    language: Language,
    firebaseDeviceToken?: string,
    userData?: AppleUser,
    deviceID?: string,
  ): Promise<AuthTokens>

  verifyUsernamePassword(
    username: string,
    password: string,
    user: User | undefined,
    source: string,
  ): Promise<void>
}
