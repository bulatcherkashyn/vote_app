import { GenericService } from '../../generic/service/GenericService'
import { User } from '../models/User'

export interface UserService extends GenericService<User> {
  findUser(username: string): Promise<User | undefined>

  findByGoogleId(googleId: string): Promise<User | undefined>

  findByFacebookId(facebookId: string): Promise<User | undefined>

  findByAppleId(appleId: string): Promise<User | undefined>

  findByEmail(email: string): Promise<User | undefined>

  updateUserLastLogin(username: string): Promise<void>
}
