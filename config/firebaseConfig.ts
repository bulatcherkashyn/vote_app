import 'dotenv/config'

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY || ''

export const firebaseAppConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || '',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
}
