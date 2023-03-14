export interface AppleUser {
  familyName?: string
  givenName?: string
}

export interface AppleIdentityTokenPayload {
  sub: string
  email: string
  nonce: string
  email_verified: string
}
export interface AppleData {
  id: string
  email?: string
  emailVerified: boolean
}
