import firebase from 'firebase-admin'

import { firebaseAppConfig } from '../../../config/firebaseConfig'
import { EnvironmentMode } from '../common/EnvironmentMode'
import { ApplicationError } from '../error/ApplicationError'

export class FirebaseModule {
  static initialize(): void {
    if (!EnvironmentMode.isTest()) {
      try {
        firebase.initializeApp({
          credential: firebase.credential.cert(firebaseAppConfig),
        })
      } catch (error) {
        throw new ApplicationError(`Firebase initialization failed. [${error.message}]`)
      }
    }
  }
}
