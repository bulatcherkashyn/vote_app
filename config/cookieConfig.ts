import { EnvironmentMode } from '../src/iviche/common/EnvironmentMode'

export const cookieConfig = {
  httpOnly: true, // to disable accessing cookie via client side js
  // NOTE: It should be tested
  secure: EnvironmentMode.isProduction() ? true : false, // to force https (if you use it)
  maxAge: 1000 * 60 * 30, // (30min) ttl in ms (remove this option and cookie will die when browser is closed)
  signed: false, // if you use the secret with cookieParser
}
