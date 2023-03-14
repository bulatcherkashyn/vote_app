import { UserRole } from '../../../src/iviche/common/UserRole'
import { AuthServiceImpl } from '../../../src/iviche/security/auth/services/AuthServiceImpl'
import { UserSystemStatus } from '../../../src/iviche/users/models/UserSystemStatus'

export const primeAdminData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000001',
  username: 'pericles@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Superuserpwd1!'),
  password: 'Superuserpwd1!',
  role: UserRole.ADMINISTRATOR,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000001',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcmljbGVzQGl2aWNoZS5jb20iLCJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDAxIiwiaWF0IjoxNTgwODk5ODg2fQ.XOCwLVPHr3xuOpWRt6n5-BfMN9EkSibRfVgYGPwEqr8',
}

export const administratorData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000002',
  username: 'ivan.mazepa@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Firstuserpwd1!'),
  password: 'Firstuserpwd1!',
  role: UserRole.ADMINISTRATOR,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000002',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Iml2YW4ubWF6ZXBhQGl2aWNoZS5jb20iLCJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDAyIiwiaWF0IjoxNTgwODk5OTYxfQ.PJ21tJR4cFhmdnzm2g3fpJZCsoBsSXAGC31FHNZDEmY',
}

export const journalistData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000003',
  username: 'lesya.ukrainka@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Journalistpwd2!'),
  password: 'Journalistpwd2!',
  role: UserRole.JOURNALIST,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000003',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imxlc3lhLnVrcmFpbmthQGl2aWNoZS5jb20iLCJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDAzIiwiaWF0IjoxNTgwODk5OTkxfQ.C_qguIpDAFValwdWJ3YY1qXh8VPqamfyZNU6QbVWYew',
}

export const moderatorData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000004',
  username: 'mykhailo.hrushevsky@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Moderatorpwd2!'),
  password: 'Moderatorpwd2!',
  role: UserRole.MODERATOR,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000004',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15a2hhaWxvLmhydXNoZXZza3lAaXZpY2hlLmNvbSIsInVzZXJVSUQiOiIwMDAwMDAwMC1hYWFhLWFhYWEtYWFhYS0wMDAwMDAwMDAwMDQiLCJpYXQiOjE1ODA5MDAwMjN9.upfNgKYVvai4W1T0SaGuR8Wj6QrxaPbek4atsBs0Uak',
}
export const publicUserData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000005',
  username: 'grigory.skovoroda@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Publicuserpwd2!'),
  password: 'Publicuserpwd2!',
  role: UserRole.PRIVATE,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000005',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImdyaWdvcnkuc2tvdm9yb2RhQGl2aWNoZS5jb20iLCJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDA1IiwiaWF0IjoxNTgwOTAwMDQ1fQ.896PjsBR_Ep8lxdaEG81QHH8L6pTRtoughzjVL46KV0',
}

export const veryfiedPublicUserData = {
  uid: '00000000-ccaa-aaaa-bbbb-000000000009',
  username: 'veryfied.user@dewais.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Veruserpwd1!'),
  password: 'Veruserpwd1!!',
  role: UserRole.PRIVATE,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000009',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtY2NhYS1hYWFhLWJiYmItMDAwMDAwMDAwMDA5IiwiaWF0IjoxNTg2NTI1OTg4fQ.ug4CF9tsxmaFUzcTIOyZJkMMG6D5eZNXwYdR_r4meNY',
}

export const bannedPublicUserData = {
  uid: '00000000-ccaa-aaaa-bbbb-000000000010',
  username: 'banned.user@dewais.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Banneduserpwd1!'),
  password: 'Banneduserpwd1!',
  role: UserRole.PRIVATE,
  personUID: '00000000-ccaa-aaaa-bbbb-000000000010',
  systemStatus: UserSystemStatus.BANNED,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtY2NhYS1hYWFhLWJiYmItMDAwMDAwMDAwMDEwIiwiaWF0IjoxNTkzMTgyMjkxLCJleHAiOjE1OTMxODQwOTF9.XHXYPtwCg3vCY1UeGlLerVXkPKp4Oxo5zWBYhmlRqWs',
}

export const suspendedPublicUserData = {
  uid: '00000000-ccaa-aaaa-bbbb-000000000011',
  username: 'suspended.user@dewais.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Suspendeduserpwd1!'),
  password: 'Suspendeduserpwd1!',
  role: UserRole.PRIVATE,
  personUID: '00000000-ccaa-aaaa-bbbb-000000000011',
  systemStatus: UserSystemStatus.SUSPENDED,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtY2NhYS1hYWFhLWJiYmItMDAwMDAwMDAwMDExIiwiaWF0IjoxNTk2MDE4NzkyfQ.mM7aKshjQBCWcPhnZnWhVL9qrRIM4Yv7iIW18sBZHc0',
}

export const limitedPublicUserData = {
  uid: '00000000-ccaa-aaaa-bbbb-000000000012',
  username: 'limited.user@dewais.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Limiteuserpwd1!'),
  password: 'Limiteuserpwd1!',
  role: UserRole.PRIVATE,
  personUID: '00000000-ccaa-aaaa-bbbb-000000000012',
  systemStatus: UserSystemStatus.LIMITED,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtY2NhYS1hYWFhLWJiYmItMDAwMDAwMDAwMDEyIiwiaWF0IjoxNTk2MDE4ODgwfQ.-0orutmGMB-WOqxXTZUxZyeun6HRsy7lS9r339XuCPw',
}

export const legalUserData = {
  uid: '00000000-ccaa-aaaa-bbbb-000000000013',
  username: 'legal.user@dewais.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Legaluserpwd1!!'),
  password: 'Legaluserpwd1!',
  role: UserRole.LEGAL,
  personUID: '00000000-ccaa-aaaa-bbbb-000000000013',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtY2NhYS1hYWFhLWJiYmItMDAwMDAwMDAwMDEzIiwiaWF0IjoxNjA3NzA3MTE0fQ.fEtjPGo8dr_kJhXVYxvELEiuLCXNupFDK-QhmMRHpNI',
}

export const regularUserData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000006',
  username: 'maria.zankovetska@iviche.com',
  passwordEncrypted: AuthServiceImpl.encryptPassword('Regularuserpwd2!'),
  password: 'Regularuserpwd2!',
  role: UserRole.PRIVATE,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000006',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1hcmlhLnphbmtvdmV0c2thQGl2aWNoZS5jb20iLCJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDA2IiwiaWF0IjoxNTgwOTAwMDc3fQ.scAPVNBkJof1rQAJR-TjNjY5EVMm7mSz0-kJTd6-cV0',
}

export const facebookUserData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000007',
  username: '100004290272604@facebook',
  role: UserRole.PRIVATE,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000007',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEwMDAwNDI5MDI3MjYwNEBmYWNlYm9vayIsInVzZXJVSUQiOiIwMDAwMDAwMC1hYWFhLWFhYWEtYWFhYS0wMDAwMDAwMDAwMDciLCJpYXQiOjE1ODA5MDAwOTd9.ov1f5P7xug0q9ZhTz7LQXqRGz7mTkvW9bW8hpLkHWKI',
}

export const googleUserData = {
  uid: '00000000-aaaa-aaaa-aaaa-000000000008',
  username: '111111111111111@google',
  role: UserRole.PRIVATE,
  personUID: '00000000-aaaa-aaaa-bbbb-000000000008',
  systemStatus: UserSystemStatus.ACTIVE,
  jwtToken:
    'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVUlEIjoiMDAwMDAwMDAtYWFhYS1hYWFhLWFhYWEtMDAwMDAwMDAwMDA4IiwiaWF0IjoxNTgxNjc0Nzk1fQ.yklV0unWClRA4wTW6lGsocIvIuARcqs8sHFe2wMI77E',
}
