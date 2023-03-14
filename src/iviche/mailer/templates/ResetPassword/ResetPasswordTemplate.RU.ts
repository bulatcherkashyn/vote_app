import { resetPasswordRedirectLink } from '../../../../../config/serverURLConfig'
import MailMessage from '../../models/MailMessage'

export const ResetPasswordRUTemplate = (code: string): MailMessage => {
  const message = new MailMessage({
    subject: 'Сброс пароля',
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
    <p>Перейдите по <a href="${resetPasswordRedirectLink}/${code}">ссылке</a>, чтобы начать процесс сброса пароля. </p>
    <p>Если ссылка не работает, скопируйте и вставьте ссылку в адресную строку браузера: ${resetPasswordRedirectLink}/${code}</p>
  </body>
    </html>`,
  })
  return message
}
