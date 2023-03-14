import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket'

import { AppleData } from '../models/AppleData'
import { FacebookData } from '../models/FacebookData'
import { HeaderInfo } from '../models/HeaderInfo'
import { JwtObject } from '../models/JwtObject'
import { RefreshToken } from '../models/RefreshToken'

export interface AuthProvider {
  getWebClientRefreshTokenHash(refreshToken: string, headerInfo: HeaderInfo): string

  getMobileAppRefreshTokenHash(refreshToken: string, deviceID: string): string

  getAuthToken(userUID: string): string

  getRefreshToken(headerInfo: HeaderInfo, deviceID?: string): RefreshToken

  decodeAuthToken(token: string): JwtObject

  decodeGoogleToken(token: string): Promise<TokenPayload>

  decodeAppleToken(token: string): Promise<AppleData>

  decodeFacebookToken(token: string): Promise<FacebookData>
}
