import * as Knex from 'knex'

import { AuthDAOImpl } from '../../../src/iviche/security/auth/db/AuthDAOImpl'
import { AuthData } from '../../../src/iviche/security/auth/models/AuthData'
import { AuthProviderImpl } from '../../../src/iviche/security/auth/services/AuthProviderImpl'
import { publicUserData, regularUserData } from '../../i9n/common/TestUtilities'

const authProvider = new AuthProviderImpl()
const testHeaderInfo = {
  ip: '::ffff:127.0.0.1',
  userAgent: {
    ua: 'node-superagent/3.8.3',
    browser: { name: 'Chrome' },
    os: { name: 'Windows' },
  } as IUAParser.IResult,
}
export const auth: Array<AuthData & { deviceToken: string }> = [
  {
    uid: regularUserData.uid,
    username: regularUserData.username,
    headerInfo: testHeaderInfo,
    refreshTokenHash: authProvider.getRefreshToken(testHeaderInfo).hash,
    // TODO: beware, tests can fail if one of these fields changes: ip, username, UA string (particulary version of node-agent). somehow rewrite it
    deviceToken: AuthDAOImpl.prototype['getDeviceTokenHash'].bind({
      HASHING_ALGORITHM: 'sha512',
      HASH_ENCODING: 'base64',
    })(regularUserData.username, testHeaderInfo),
  },
  {
    uid: publicUserData.uid,
    username: publicUserData.username,
    headerInfo: testHeaderInfo,
    refreshTokenHash: authProvider.getRefreshToken(testHeaderInfo).hash,
    // TODO: beware, tests can fail if one of these fields changes: ip, username, UA string (particulary version of node-agent). somehow rewrite it
    deviceToken: AuthDAOImpl.prototype['getDeviceTokenHash'].bind({
      HASHING_ALGORITHM: 'sha512',
      HASH_ENCODING: 'base64',
    })(publicUserData.username, testHeaderInfo),
    deviceID: 'coolDeviceID',
    firebaseDeviceToken: 'firebaseDeviceToken',
  },
]

export async function AuthDataSeed(knex: Knex): Promise<void> {
  await knex('auth_data').insert(auth)
}
