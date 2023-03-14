import { aboutSystem, serverURL } from '../../../../../config/serverURLConfig'
import MailMessage from '../../models/MailMessage'

export const WelcomeENGTemplate = (): MailMessage => {
  const message = new MailMessage({
    subject: 'Welcome',
    html: `<!doctype html>
    <html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
    
    <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>Новое письмо 3</title>
        <!--[if (mso 16)]>
            <style type="text/css">
            a {text-decoration: none;}
            </style>
            <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Oswald:300,700&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style type="text/css">
            @media only screen and (max-width:600px) {
    
                p,
                ul li,
                ol li,
                a {
                    font-size: 14px !important;
                    line-height: 150% !important
                }
    
                h1 {
                    font-size: 28px !important;
                    text-align: left;
                    line-height: 120%
                }
    
                h2 {
                    font-size: 20px !important;
                    text-align: left;
                    line-height: 120%
                }
    
                h3 {
                    font-size: 14px !important;
                    text-align: left;
                    line-height: 120%
                }
    
                h1 a {
                    font-size: 28px !important;
                    text-align: left
                }
    
                h2 a {
                    font-size: 20px !important;
                    text-align: left
                }
    
                h3 a {
                    font-size: 14px !important;
                    text-align: left
                }
    
                .es-menu td a {
                    font-size: 14px !important
                }
    
                .es-header-body p,
                .es-header-body ul li,
                .es-header-body ol li,
                .es-header-body a {
                    font-size: 14px !important
                }
    
                .es-footer-body p,
                .es-footer-body ul li,
                .es-footer-body ol li,
                .es-footer-body a {
                    font-size: 14px !important
                }
    
                .es-infoblock p,
                .es-infoblock ul li,
                .es-infoblock ol li,
                .es-infoblock a {
                    font-size: 14px !important
                }
    
                *[class="gmail-fix"] {
                    display: none !important
                }
    
            
    
                .es-m-txt-r,
                .es-m-txt-r h1,
                .es-m-txt-r h2,
                .es-m-txt-r h3 {
                    text-align: right !important
                }
                .es-m-txt-l td{
                    padding-left: 0px !important;
                }
                .support td{
                    padding-left: 0px !important;
                }
    
                .es-m-txt-l,
                .es-m-txt-l h1,
                .es-m-txt-l h2,
                .es-m-txt-l h3 {
                    text-align: left !important
                }
    
                .es-m-txt-r img,
                .es-m-txt-c img,
                .es-m-txt-l img {
                    display: inline !important
                }
    
                .es-button-border {
                    display: block !important
                }
    
                a.es-button {
                    font-size: 14px !important;
                    display: block !important;
                    border-bottom-width: 20px !important;
                    border-right-width: 0px !important;
                    border-left-width: 0px !important;
                    border-top-width: 20px !important
                }
    
                .es-btn-fw {
                    border-width: 10px 0px !important;
                    text-align: center !important
                }
    
                .es-adaptive table,
                .es-btn-fw,
                .es-btn-fw-brdr,
                .es-left,
                .es-right {
                    width: 100% !important
                }
    
                .es-content table,
                .es-header table,
                .es-footer table,
                .es-content,
                .es-footer,
                .es-header {
                    width: 100% !important;
                    max-width: 600px !important
                }
    
                .es-adapt-td {
                    display: block !important;
                    width: 100% !important
                }
    
                .adapt-img {
                    width: 100% !important;
                    height: auto !important
                }
    
                .es-m-p0 {
                    padding: 0px !important
                }
    
                .es-m-p0r {
                    padding-right: 0px !important
                }
    
                .es-m-p0l {
                    padding-left: 0px !important
                }
    
                .es-m-p0t {
                    padding-top: 0px !important
                }
    
                .es-m-p0b {
                    padding-bottom: 0 !important
                }
    
                .es-m-p20b {
                    padding-bottom: 20px !important
                }
    
                .es-mobile-hidden,
                .es-hidden {
                    display: none !important
                }
    
                .es-desk-hidden {
                    display: table-row !important;
                    width: auto !important;
                    overflow: visible !important;
                    float: none !important;
                    max-height: inherit !important;
                    line-height: inherit !important
                }
    
                .es-desk-menu-hidden {
                    display: table-cell !important
                }
    
                table.es-table-not-adapt,
                .esd-block-html table {
                    width: auto !important
                }
    
                table.es-social {
                    display: inline-block !important
                }
    
                table.es-social td {
                    display: inline-block !important
                }
            }
    
            #outlook a {
                padding: 0;
            }
    
            .ExternalClass {
                width: 100%;
            }
    
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
                line-height: 100%;
            }
    
            .es-button {
                mso-style-priority: 100 !important;
                text-decoration: none !important;
            }
    
            a[x-apple-data-detectors] {
                color: inherit !important;
                text-decoration: none !important;
                font-size: inherit !important;
                font-family: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
            }
    
            .es-desk-hidden {
                display: none;
                float: left;
                overflow: hidden;
                width: 0;
                max-height: 0;
                line-height: 0;
                mso-hide: all;
            }
        </style>
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
        <!--<![endif]-->
    </head>
    
    <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
        <div class="es-wrapper-color" style="background-color:#F5F5F5;">
            <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f5f5f5"></v:fill>
          </v:background>
        <![endif]-->
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;">
                <tbody>
                    <tr style="border-collapse:collapse;">
                        <td valign="top" style="padding:0;Margin:0;">
                            <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;">
                                <tbody>
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" bgcolor="#2a2f41" style="padding:0;Margin:0;background-color:#2A2F41;">
                                            <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#2a2f41" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2A2F41;">
                                                <tbody>
                                                    <tr style=" border:5px solid #2a2f41; border-collapse:collapse;">
                                                        <td align="left" bgcolor="#2a2f41" style="padding:0;Margin:0;padding-top:20px;padding-bottom:20px;background-color:#2A2F41;">
                                                            <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style=" border-collapse:collapse;">
                                                                        <td class="es-m-p0r" width="600" valign="top" align="center" style="padding:0;Margin:0;">
                                                                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="center" bgcolor="#2a2f41" style="padding:0;Margin:0;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#BCBDBD;"><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr style="border:5px solid #2a2f41;border-bottom:0; border-collapse:collapse;">
                                                        <td align="left" class="support" style="padding:0;Margin:0;padding-top:30px;padding-left:55px;padding-right:55px;border-radius:20px 20px 0px 0px;background-color:#FFFFFF;" bgcolor="#ffffff">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="540" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px;"><a><img src="https://hctgra.stripocdn.email/content/guids/CABINET_b7d59b58e60815b6064e71f86c8cdf2e/images/10961588336222398.png" alt="iViche_Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="134" title="iViche_Logo"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr style="border:5px solid #2a2f41;border-top:0;border-bottom:0;border-collapse:collapse;">
                                                        <td align="left" class="support" bgcolor="#fff" style="border-top:0;border-bottom:0;padding:0;Margin:0;padding-left:35px;padding-right:35px;padding-top:20px;background-color:#FFFFFF;">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="580" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;" bgcolor="#ffffff" role="presentation">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" class="es-m-txt-l" style="Margin:0;padding-bottom:15px;padding-left:25px;padding-right:25px;padding-top:30px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#262626;">Вітаємо, ласкаво просимо!</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" class="es-m-txt-l" style="Margin:0;padding-top:15px;padding-bottom:15px;padding-left:25px;padding-right:25px;"><span style="font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:17">Для завершення реєстрації необхідно спочатку<br>підтвердити Вашу адресу електронної пошти</span></td>
                                                                                    </tr>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" style="Margin:0;padding-top:15px;padding-bottom:30px;padding-left:25px;padding-right:25px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#BCBDBD;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#E06666;" href>Підтвердити</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tbody>
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" bgcolor="#2a2f41" style="padding:0;Margin:0;background-color:#2A2F41;">
                                            <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-left: 5px solid #2a2f41;border-right: 5px solid #2a2f41;border-collapse:collapse;border-spacing:0px;background-color:#F5F5F5;">
                                                <tbody>
                                                    <tr style="border:5px solid #2a2f41;border-top:4px solid #eef2fb; border-bottom:0; border-collapse:collapse;">
                                                        <td align="left" bgcolor="#fff" style=" Margin:0;padding-top:10px;padding-bottom:10px;padding-left:35px;padding-right:35px;background-color:#FFFFFF;">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="560" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#1394FB;" bgcolor="#1394fb" role="presentation">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" class="es-m-txt-c" bgcolor="#ffffff" style="Margin:0;padding-top:10px;padding-bottom:5px;padding-left:25px;padding-right:25px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#262626;"><em>Ваша команда Viche Internet</em></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#111517;background-repeat:repeat;background-position:center top;">
                                <tbody>
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" bgcolor="#2a2f41" style="padding:0;Margin:0;background-color:#2A2F41;">
                                            <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#111517" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#111517;">
                                                <tbody>
                                                    <tr style="border:5px solid #2a2f41;border-top:0;border-bottom:0; border-collapse:collapse;">
                                                        <td style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:55px;padding-right:55px;background-color:#FFFFFF;" bgcolor="#fff" align="left">
                                                            <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="118" valign="top"><![endif]-->
                                                            <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td class="es-m-p0r es-m-p20b" width="118" valign="top" align="center" style="padding:0;Margin:0;">
                                                                            <table width="100%" cellspacing="0" cellpadding="0" bgcolor="#2a2f41" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2A2F41;" role="presentation">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td class="es-m-txt-c" align="center" style="padding:10px;padding-top:5px;Margin:0;font-size:0px; background:#fff;"><a><img src="https://cdn1.radikalno.ru/uploads/2020/5/1/b41a7a5f73aac61962fe7cbde01587ce-full.png" alt="iViche_Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="108" title="iViche_Logo"></a></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td><td width="20"></td><td width="422" valign="top"><![endif]-->
                                                            <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="422" align="left" style="padding:0;Margin:0;">
                                                                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <!--<tr style="border-collapse:collapse;">-->
                                                                                    <!--    <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-top:5px;font-size:0px;">-->
                                                                                    <!--        <table class="es-table-not-adapt es-social" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">-->
                                                                                    <!--            <tbody>-->
                                                                                    <!--                <tr style="border-collapse:collapse;">-->
                                                                                    <!--                    <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;"><img title="Facebook" src="https://hctgra.stripocdn.email/content/assets/img/social-icons/circle-black/facebook-circle-black.png" alt="Fb" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>-->
                                                                                    <!--                    <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;"><img title="Twitter" src="https://hctgra.stripocdn.email/content/assets/img/social-icons/circle-black/twitter-circle-black.png" alt="Tw" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>-->
                                                                                    <!--                    <td valign="top" align="center" style="padding:0;Margin:0;padding-right:10px;"><img title="Instagram" src="https://hctgra.stripocdn.email/content/assets/img/social-icons/circle-black/instagram-circle-black.png" alt="Inst" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>-->
                                                                                    <!--                    <td valign="top" align="center" style="padding:0;Margin:0;"><img title="Youtube" src="https://hctgra.stripocdn.email/content/assets/img/social-icons/circle-black/youtube-circle-black.png" alt="Yt" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;"></td>-->
                                                                                    <!--                </tr>-->
                                                                                    <!--            </tbody>-->
                                                                                    <!--        </table>-->
                                                                                    <!--    </td>-->
                                                                                    <!--</tr>-->
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;">
                                <tbody>
                                    <tr style="border-collapse:collapse;">
                                        <td align="center" bgcolor="#2a2f41" style="padding:0;Margin:0;background-color:#2A2F41;">
                                            <table bgcolor="#2a2f41" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#2A2F41;">
                                                <tbody>
                                                    <tr style="border:5px solid #2a2f41;border-top:0; border-collapse:collapse;">
                                                        <td align="left"class="support" style="Margin:0;padding-left:55px;padding-right:55px;padding-top:10px;padding-bottom:45px;border-radius:0px 0px 20px 20px;background-color:#FFFFFF;" bgcolor="#ffffff">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="580" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" class="support" style="padding:0;Margin:0;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#262626;">&nbsp;<a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#262626;" href="${aboutSystem}">Про систему</a>
<!--                                                                                             &nbsp; &nbsp; &nbsp;<a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#262626;" href>Підтримка</a></p>-->
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr style="border-collapse:collapse;">
                                                        <td align="left" bgcolor="#2a2f41" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:20px;background-color:#2A2F41;">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="580" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="center" style="padding:15px;Margin:0;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;">Дякуємо за увагу! Ви отримали цього листа оскільки стали користувачем <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#FFFFFF;" href="${serverURL}">iviche.ua</a></p>
                                                                                        </td>
                                                                                    </tr>
<!--                                                                                    <tr style="border-collapse:collapse;">-->
<!--                                                                                        <td align="center" style="padding:5px;Margin:0;">-->
<!--                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#5A5F71;">Якщо ви не бажаєте отримувати інформацію про актуальні новини, опитування та інше - будь ласка, перейдіть за посиланням <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#5A5F71;" href>Відписатися</a> | <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#5A5F71;" href>Поскаржитися на спам</a>.</p>-->
<!--                                                                                        </td>-->
<!--                                                                                    </tr>-->
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="center" style="padding:0;Margin:0;padding-top:40px;padding-left:40px;padding-right:40px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;">Copyright © 2020</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr style="border-collapse:collapse;">
                                                        <td align="left" bgcolor="#2a2f41" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:20px;padding-bottom:20px;background-color:#2A2F41;">
                                                            <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                <tbody>
                                                                    <tr style="border-collapse:collapse;">
                                                                        <td width="580" align="center" valign="top" style="padding:0;Margin:0;">
                                                                            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;">
                                                                                <tbody>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" style="padding:0;Margin:0;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#262626;"><br></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
    
    </html>`,
  })
  return message
}
