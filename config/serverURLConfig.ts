export const serverURL = process.env.SERVER_URL || `localhost:${process.env.SERVER_PORT || 5000}`

const apiSuffix = '/api'

const emailRedirectSuffix =
  process.env.EMAIL_REDIRECT_LINK || '/user-profile/my-profile/email-confirmation'

const resetPasswordRedirectSuffix = process.env.RESET_PASSWORD_REDIRECT_LINK || '/password/reset'

export const apiServerURL = process.env.SERVER_URL + apiSuffix

export const emailRedirectLink = serverURL + apiSuffix + emailRedirectSuffix
export const resetPasswordRedirectLink = serverURL + resetPasswordRedirectSuffix

// Email template redirects
export const aboutSystem = serverURL + '/info'
