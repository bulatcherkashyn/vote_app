import { TrxProvider } from '../../../db/TrxProvider'
import { AuthData } from '../models/AuthData'
import { NotificationAuthData } from '../models/NotificationAuthData'

export interface AuthDAO {
  createSession(trxProvider: TrxProvider, authData: AuthData): Promise<void>

  deleteUserSessionsByDeviceToken(trxProvider: TrxProvider, authData: AuthData): Promise<void>

  deleteUserSessionsByDeviceID(trxProvider: TrxProvider, authData: AuthData): Promise<void>

  dropExceedingMobileSessionsIfAny(trxProvider: TrxProvider, username: string): Promise<void>

  dropExceedingSessionsIfAny(trxProvider: TrxProvider, username: string): Promise<void>

  get(trxProvider: TrxProvider, uid: string): Promise<AuthData | undefined>

  delete(trxProvider: TrxProvider, uid: string): Promise<void>

  getFirebaseDeviceTokens(
    trxProvider: TrxProvider,
    userUIDs: Array<string>,
  ): Promise<Array<NotificationAuthData>>

  removeAuthSession(trxProvider: TrxProvider, refreshTokenHash: string): Promise<void>

  getTokenDataForNewPollNotification(trxProvider: TrxProvider): Promise<Array<NotificationAuthData>>
}
