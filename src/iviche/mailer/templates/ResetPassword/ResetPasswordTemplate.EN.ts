import { resetPasswordRedirectLink } from '../../../../../config/serverURLConfig'
import MailMessage from '../../models/MailMessage'

export const ResetPasswordENGTemplate = (code: string): MailMessage => {
  const message = new MailMessage({
    subject: 'Reset password',
    html: `<!doctype html>
    <html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Password resetting</title>
    </head>
    
    <body>
    <p>Сlick on the <a href="${resetPasswordRedirectLink}/${code}">link</a> to reset the password. </p>
    <p>If the link does not work, copy and paste the link directly: ${resetPasswordRedirectLink}/${code}</p>
  </body>
    </html>`,
  })
  return message
}
