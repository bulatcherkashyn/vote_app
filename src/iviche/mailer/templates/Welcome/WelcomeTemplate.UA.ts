import { aboutSystem, emailRedirectLink, serverURL } from '../../../../../config/serverURLConfig'
import MailMessage from '../../models/MailMessage'

export const WelcomeUATemplate = (email: string, code: string): MailMessage => {
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
                                                                                        <td align="left" class="es-m-txt-l" style="padding:0;Margin:0;font-size:0px;"><a><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAe4AAACOCAYAAAD3lOu4AAAACXBIWXMAAAsSAAALEgHS3X78AAAgAElEQVR4nO2dbYxcV3nHz44dO7E92Y0DWQiE3bA0NLAbb4CWaSrkMa02aYvqjUoVJCp7FwpFgOp1hVSpUjUzfKgq8cG7HyqlL5CdIBCBCs8GEIlb4l0gsBCCZ7JLAwEnO01I2RAnnmw2iRN7pnrG/+tcT+blvpxz7rnnPj9pRbA9d+7el/M/z3tfo9EQTLRkcqvDQogZIURWCLGn5WSqQohFIcT8cmF0kW8VwzBMsmHhjpBMbnVACDErhDjo8SyWSOCXC6NlKy8IwzAM0xMW7ojI5FYnyYoWQvQHOIPDy4XRWSsuBMMwDOMLFm7NBLCyO7EghJhaLoyetuG6MAzDMN5g4dZIJrc6Diu7NY4dFIp/T7LrnGEYJjmk+F7rAa7xRYmiTQwJIU5kcqszJv/uDMMwjDzY4tZAJreaF0LkFH8Tu84ZhmESAAu3QhDPLgkh9mr6SnadMwzDWA67yhWBeHZZo2gLdp0zDMPYD1vcCsjkVqeQOR6k1EsW7DpnGIaxEBZuiUgs9ZIFu84ZhmEsg13lkoBrfNEg0RZwnS/CA8AwDMNYAFvcEjDENd6LItqlsuucYRgmxrBwhySTWyXBPhST060g7s2uc4ZhmJjCwh0QxLOpC9r+mJ16DeJdMuBcGIZhGJ9wjDsAGMO5GEPRFnDnH4WngGEYhokZbHH7xJWEZnI82ytLyDrnuDfDMExMYIvbB65+4zaItkBzmDVsRhiGYZgYwMLtEWSOH7VItB360W2NS8YYhmFiAAu3ByBqdxh/ouG4g+PeDMMw5sMx7h5omuxlEjdyuRjDMIy5bOV705lMbnXesE5oDMMwTMJhV3kHEirac2xtMwzDmA1b3G1IoGhX0ZRl0YBzYRiGYbrAwt0CYtpJEW3qoja7XBjNG3AuDMMwjAc4Oc1FQrLHhSPYEG1uvsIwDBMj2OIGCRLtAgs2wzBMfGHhTo5o01jP/HJhdC3oAerraRqs4nRZW0sNbgQ+FsMwrzIyNkHzD7JCiGHXH1OiaPnkyjF+z5iLSLyr3LLe4+1YwhzuwNni9fU0LSYzlMDWcp0W6M9SgxtsvUcAFntnoT99cuUYVwTEjJGxiSzCVnu6nDm9Z3m+v4xDooXbctGuQrADj++sr6ezEOtuyXoUL59MDW5wRroGINa0iaK++UMt30j3ooRFnq00gxkZmxiAYPtJhD18cuUYdzdkkivcmKddbrP42UCoOHZ9PT0Jcdjr42OF1OAGZ6crZGRswk8Xv7mTK8dmYvmLJoCRsYlFn++XQ+HkyjF+zxJOkoW73MM9FUcqqMcO5FKrr6fJus6H2Mwswfpm17lkRsYmgvQWoOche3LlGN8PgxgZmyCr+VCIM9p3cuUYe7gSTCKT09BgxTbRLgStx5Yg2A7NMaFksbPrXB4BRVvgGZ+HW50x414OhxRtgXs67OHfMZaSuJanmdzqjGUNVioYDOJbtEmw6+vpNWTUywoZUL7A8fp6mt15EhgZmwj7vO4fGZvgka3mIOO9GBoZm+DNWIJJlMWdya3Sw37EgFORBfUW9x3HRNJZPmCMzSu5+np6nLPOgwPBlfG85mGlMdGTlXQGk0hEZBJIYixuZJDbsnhR9vCtfkWbyrrq62l62Y8rFm2H/ZQACAFnfDAyNjEusbfAEI7HRAgyyWV5tthVnmASIdzIIJ+3pOyLXOPDfsu84LouQ0x1QgvVifp6mjOcPQKRlZ0jwK7V6JG5edKx8WYMJSmu8l4NDuKCb9c43OLzBpS9HXHqwtl13hlYZSUFm8wBycdjGCYirLe40c407slo5Bqf9iPa1J60vp6ehVvclFp1dp13AaK9qOh+sWuVYSzBauFGXDvunYZItLPLhVHP8XlYtmUJZScqYNd5Z1SWKXK7TIaxBGuF25K4thPP9rzoGmhld4Jc5yUMLkk8qNVWmX/ALVAZxhJstrjzMY9rL8DS9hQPJvdzfT1tqpXdCXady6nV9gI3xGEYS7AyOS2TW5XRnShKisuFUc9NM9D5bDam3gXyDCyS6zw1uJG4WmOJtdrdWOChIwxjD7Za3HFOxCl4FW0koM2j3jfOIQE69zvod0mS6xxlXzpyMDifgGEswkrhXi6MLiI+HDemvbYuxYzsRcvatx6E9W2969xVq616w3WYrW2GsQtrY9zLhVFaGIsGnIpXpr1mjkPYbJxuJvA7LcL9byUo+9KROFnk+c0MYx9Wl4PB5XzruZee23i59qQBZ9QRP6JNv9MJ34v+qUtE3yOXib5v7T7/s3x58/8birWuc1ettupNF8W1ebgIw1iI9Z3TqDVoJrd64LlfLh7dFEJc/jv7xJZL0wac2QX8iDa50XN+Dt4U6Pv6hXhie/u/F0I0Mhui8WfPCHHlK34OrQNynVO2PHVbs6UOWUcXv+ZcdsXfwTBMRCRlyEizpOqV2pPimfLXxJlTj0V/RufxI9rzvkT7ie0i9U/XiL47r+oo2g59y2mR+sch0fe113k+vEascZ2HmKvthyqVEZ5cOcZtZRnGUhIh3C/8+qHbX4GrvHH2ZVF7+F6x+b8/ifq0PIm2K3Pc+4JPon3kTT0Fu5W+4wNNsRcvGvdYxN51jrIv1aJNXfYmWbQZxm6sF+7xT5Y+t/n4T97e+uck3M+u3C0aZ89EcVqeRdt35rgj2kHFlz5/+xuDfVY9scw6HxmbmJQ4orMbZGlza1OGsRyrhftdh+593+bajz5DVnY7mq7zE/8pzm4+rfO05nyKtq94aIpc42Et5l+eT2IzFMd1HosxlSj70tFYZppFm2GSgdW9yl944sQ3zp3Z6Prv6O9JvF9a/4WO0yp6mfAVVLQpEc2ve7zjsUi4T10i5VgKINf5UdSyG8vI2MSwxlrtxHWdY5ikYq1wP//YD469fPoJzwvmc788Lp575LhK1/mSl45oQUWb6PumXCuZktYMx1irW+Fc7Va4VpthEoaVwn3DR7/4zy/8+qHf8/u5l576RTPurcB1XvEiMmFEu2lpPyO3uq+vslPq8RRgckcwrtVmGEYJ1gk3xbVf/L//+fugnz+7eaop3hJLxmo+pnyVgi72SpqpSHK7K2IhNbhRMvHEUPbFtdoMwyjBqgYsNBXshScf+k6vuHYvnJKxHVePiV1v/cMwh/Is2ij52hv4mxSVcNGGoHHdi0qO7YMlWNdrsGTLqcENI0ueRsYmZjWVfXGtNsMkFGuEm5LRNh9/8P6Xn6lKy6h64ckV8crmKTFw/c2ib2sg63NmuTDaM9O3vp7WsdjHhaojzvS/ceqYhlpt1eNkWbQZJuFYI9xnX3j2ns3qA1fLPi6VjD39ky+J/utvEdv6fR3ea9mXjsXeZGoQ6hKEOpaTrEbGJrKaarUnueyLYZKNFcKdya3Ob91xxXt3vuU9Sjqikev89MrdYtdbbxI7rr7By0eWPJZ9yVvsrzwr5TCtKHKTVyHUpdTgxqKKL9AJarV1xNupVjv214thmHDEXrhJtB03Mwn31p1XNku7OjVdCcPzj/6gaYHToJIurvOqxwxyqYt9481nmgNDpPJmqaVxNfy+sxYNDHFP+1Jd9lXgWm2GYUTchdst2g7br7xWXHFpulmTTRnisjlzak08+9Ld4vLr9omtO9sO5ZjslYyGsi+585hJZHeflVoSRlPDJECJZfOpwQ3rREejaFOtdl7xdzAMExNiWw7WTrQdSFCvGPtzcelVr2lRLgWnZKxNt7XDXpLRINrSy4UaH3hG3sEuq4vGHzwX5ghFIcSNqcGNrI2iDQKX7/lgiWu1GYZxE0uLu5toO5Arm6xiSijbeOx+6a5zOh655F8m1/l1+wTi2j07WGGm9n6pJ+OcU+Y50ffDdLPXeOhj0Xzuy+p+P1bDpmQ2rklmXkGtdvDyPW94atxjO0j8G8YPQWGm1ilxZYzvPY3/Xju5cszqZ9Av8BCNu66f8//dODkUdO3KnAh5oXXxcMtzl235Z85zJ5xnUWU+Sl+j0VB1bOlQyReJgt/SKeqEpsp1Lpru+WHKOr91uTDaNWaNZLTjSk7C4dQloUdzkou8cWDd78fmhBB5U+urZTIyNpH3NRs9GLQJGk5a2RcWyazrZyjE4ZyKheZP1CKEDYi09//kyrGeaS1InJzC9QzqHVpykkmTsBnCNZvENRsPGQqrtDyDUt7n2Ag3RDtwG0nqQb7x6A+abU1VcMUNkw8+eOSP39Pp0BiIUdYQDw012rMp2n/5Wz/WdhGCnQjrBrXaqsu+akka0QlLcAo/KkMPTjXDbBQCpEu4XddzJuTGpx0LuH5WVTdArGcg2CrX6AVsgEKFD2Mh3JncqpOBHfohpLi0Ctd539ZtYseb9jy585p3v7Ndclp9PV3WEA99lRdT5+dq+3Cbk3u86SL3Bu0kZ2wo5/KK7IW3C/uSUPaF6zkVUfMhsiLzOq+zauGGYM/gR7WBoP36yQbXi4Q6r2CD04savMfzQTaRxgt3Jrc6hV9Q2oN47qUNUXv4HiWu8227h17ZcfUNf/TTuZu/5/wZOqNF0mSl2cP8vgHR91CHgSG7z4rGnudF4/01Ia58xcsha7CwEzWRCjtyHRnk07aXfUHA8hpyBLygTYBUCjeOPR+BAM3h+sUqpINwl44NjhfIaznj5xoaLdyZ3KpSwXv+0fubbU1ls3Xn7nPbBt784dU7P36Xlri2R1oHkTSoaYs3sXZYgJWdqKQf7MzLGhbFgs1lX4hfz6pKzgwJCfiUShe6KuFGf/wouy9W49LRb2RsYhLPoO4NTi9qCEF4ev+NFG4aFqKp1KaZFU7Wt2zX+Zbtu+rnzjx/5a++XJzRkMikmkRa2eLiWm3Vz2LR5rKvkbGJGVjZJlg4najBelTynCsItVyh6dn0gtF5Gdg06qgECUsFG8iu19G4Ou5MbnUG1o2Wh5HKxV73ng83M8Nlcu7M8ynE7+JundKDNJ5E0QY6RnRaW6tNG5+RsQkSlyOGi7bA+R0ZGZsoYcNmOqaItsC1OwGL1ihwTuUYiLbA/VxEEmxHjBFusrIzudVIXnCq+aYhItSLXBZbtqefcXUMO4wdadyYSw1ujCfNNe6AWm3Vbl1ra7WRF7AWkwXTzX4snq01zqZhimi7mTfpuiGMcDQGm0Y3dK534NzbYoSrPJNbNSZRQEbNd9+WbY0dV49euzL/karzZ+hNrsN6k0ENsezE9saGa/eI4q+xtlZbU9mcaqS6fzVWJURN5M81PCY6Nt6qaRtCi1S4M7nVqDIhu0I13zRlLGji2s6h3//YyhcO/Efrn6NHuemzt5uJJjYNAvFLHGq1EbNzmkS43bqnXc0yIlk4LRFtB2ninSDhFgj/tHYX04LGvBRdvEa8IxFu1GXPmu5CO3PqMd+Txi57w/X3/uxLn7ql27/5/jd3vbjjMnHp+Kj0eV5hIbdtNgndzzoBN98JDV8VqFYbi5KXzZ+vLFVZWCbaDnQtx8NmnCdMuEUUpY0WirbDReKtVbiRLZ433OK8CLK+Tz98b3OcZy+29V/99M+//g+v7/bPfvjtXX96/P76t86cEaL/ciEm/yQlhq8xQsCp1Guqm2i7eh27Kdvi6jW9Vts199uPh6oCi1H5PbJUtB0qJ1eOhYrdJlC4tbrMLRZthwvrhpbkNHKJZ3KrtOA8FifRFkhco0ljNOu7G1t3XPHyJZe/oes/Ilf5IycbXz6DMde154Qo3lUX99xXFy9JHX3tm2JqcGOyk2jTgkOZtkKIZ7HwuH+eRRZuJG4xWbhiYkbO1XYtSn7DSk6WqtIsadx/W0Wb2NMtWYhpSz9yl3Qxa7FoE7NO4p9S4aauZ8gUPx73JAES7t03fpCyxV/zd5SMtu2Kaw64k9Hacf+PG/c9Wm28Rhh+9NOGmP9KXfzmqUjyDUi025YeuEp5et0/+rvjcV3YNNdqB3Vdl0JsKvbA06UExNu7DtixhENx36BGwIyO0jokk8bKKAxAPzYn8oUbZV2zmdzqaezA41YK0hGa803i3VrznX7rTXnqktbtsw8t7frcf3+3fmOnv1//bUP86511UV7VKt7dRDtIKc8hlFDFDR079UrQWm2IRdj36BAEVgVhNhVxw9rOdoroV13uiLVKdQWIKeylkJQU4YZYz2Ryq2W4ww/Z+iK7a75psMjOa979hfLtH/xst888Xt71gW/+V/0zXo6/cE9dlL7tew52ELpa2iEW44Nxsryx0VC9U6+0md/rB1nuRukLKHo+2+yebGVvDOq7TUOZu9y1ViWJqa1Bf1lkhk/iJ0kvbpMdV99AP8XlwuhHu/07Gud5972N0hkfMezKzxriN0/VxdSHUuLS7RJO9rV0FG0QtpcvWXcl0ycHIZlKtWjX0Mc5TIKOLPes06dZCrDgo2rnW0Hpm4NOz14WnbjiQuu1IoY1luFSfsCwoj7wKkaXeqHW8gzovJ57PQs3hNo94D4prrFOkGh3dX1SMtpX764/+NTTjS1+D06u89l/OyembkuJN1wlNeu8q2hjMZYhZnmJgiMdzbXagRcsWBSy3jXZlqKusEjNqU1HFUPb64ln121QqFqj4tAOdQn3p2M9v2us5ZSGjY/UTaPQv3Gs4HqWuxkk8MZk8fsqu6ZthRuNUYbxk8XLkHShdtNTtIkHTjS+/vAjjd1Bv4SsdIp7778lJSTVfFc8uK1kuVPJpUiWpnFuLLxcOtz5PYcFeECm2Ep7hyXF3XtRQS26pw0CBH3NcZ1icxbFrOUoqWBEZE9vFwR9Hm1KVTfDyip453S8w0UMnvG0+cb7XkYGuLLy56ZwY+a1Y0kn6SEPQsWLaP/25+lPfuf79X0yvpDi3muP9zVrvsOct8fmKjLjoLOmxZ/wMumq1bY59qYySasG8Qll0ePz8zGZTCaDwBPmSOhdG1oV4SOp3jdsNFRWKoUe84rPTiEPROo42xQSyu7AzWLR7s6SlweQZnA/cKL+L37i2r2guPftxbo4HWxUSa1XcxVFDPWacqOTkEl3fpjT3TFKJ4qt7Qqadki7fhjTOY5jy8DE+PbhsBPmyALHMYryTusC/ZKrGlSuK3QtQ4W4WhiA91oaqSQmlgWE3OPZ5cJoV/HDMJESubYHXy+3IxrFvW+/81yQkrEoe4/nDRqRqKtWW2fTiShQ9fvRtRtX0WmLFmF0PgsrSjUDPSlFyTPEZyRuctxIES+JeTjtmJZ5LeHtOSF73UnFdNykbjzFtDFEpNl9ixLKKCv8ve+SK95kxZPr/Cslz93WDqcGN6LM7h7S3D2pLSj7MrZWOy5g0VTholzQce0kWJSmlTpWZb9f2DipuBey3OWqnhNpvdXpPXHNoZdOSrHLwQY8iTa4yKKjUq5b3p8St02mxHbJZV2/+BW5zs/16ra2kBrc8LvQqLDMtXRP6gTqyk2v1Y4LKpppVHSuQxDvhQAfrege2uKBvCIPRVmRy1wGKp6VQK2I24HwYFlhOKmaWi6MkttnWtEXxJ3DXkW7vp7uaNH97tv6xCcObJHuOqde55R1vvxgW/GuBnzAVVjnunsWXwAv0SHFXyOjVjsuqFg0pyK4dlM+3cEmbsxqinMpZB87dIUEEuhk52ItydiQoUV0CTljKvNo5ptpysuFUbpB+9htfgG6DtPLhVFP1ipEu6tFN9AvxCcOpsTem+RPArv3eFvXecehId1A/K5rz/WAzChsudkWKkeLQ612XIDXRHa4YU7GrGu/YKNAQjzX46M1WGNKYu8hUZoAiZIymWuBDK+bCo9P6M0oEjbXNMzkaI7rvVBftFwYXUTywJLiLzad5kKMzUxPvIi2m+xNKXHwNuWu82LIZDQV7sB+nX2esTPXkdkto1Y7Lsi2OGtR9v5GFjV5gq4l7xpcw0v4KcITOWyge9xBR+6Kac+27GewGLZBEkJxxzWVGzZDIxc1YEHGNI3gzEfYyjBKKhBtTztrv6LtQPO3Zz6+pWklVx+XN1SEXOfzd9XFX/1F6vRbBoMfh9xvcDHLjtFQH3PPzQyCwrXaypC9aHbs6qUTPI9xnGynQ1TLhk12lL0mBd6UBZyPH4YL1QNtO3osF0bpl7k1Ya5zSkIbVy3aDpS4Ru1Mb94nd0AbZZ1/41jj0ycf2PW+kIdSZWUoXSC5Vlspslum8nzrEGgKzxhjcSsY7lIJeg3RVOWERtFecucJdVQNJK3JbFpgKk4823OcI6xou8m8u0/8zYGU6L9c3tWh3uj33Nc4vnT3rr8OegzEt1SETfYrnmlc4lptZci0dqoJCjHEGZPi+pH32qfNw8jYRFmzR3oODWEu3Iuu5t5yYXSNrFAPCRxxpeIznj1QX0+XZZcWUc33Jw5uEW9/m7zENRLv+39c//fvfH3n50McRpU4KbHmUautvH+27bXa7VBQzmf05DjGSGQnt/p6BtFMRUcTJwdKDNzXzkjw5KddLozOWOg6L0K0Pe360RGtrOqmkev8Q5Op5kARWYlr5Db/7g8bH7n3qzsDxWEV1nLulW11w3XFtdrqkG3tsHAzfpH6DHr1+CABzWmmoqvfPVUyDHcaFuM5wGqR65w2H7eSa9xHPHsSC43yeAa1SqXYt8ya7wcfaoRJLlEV65YWH0YinWrXVZJqtXVgffkcIx2ZXh9PYUCUlK5pnPdO+npjr0oGX5lRLte5qR11ekE3axybEE/U19N0AY/qnCzktEvd80454v3Gq/qeDvpZJG8UpJzIxUgZQALLnWu11SPbTcnxbcZYXM1UdK39NQw3GffiCQiU0oxErukYuc5r6IJGrnFPiy/i2aWoyuLIdU5jPMO2S6XPvnFQfDrk6cwqutehrHlXOYZqZjiRSq5ws+eCiZiO7zOMAZ1lcE2D0s9wk8C1SEjoysbAde5Y2Z4viiueHXn9Yth2qe+4ru/zt9y2eVeYc8Aiq6J0ZwgJH75BspSuWu2klX0xjO203Ti6mqnoKPOqYX3x7c0LVUSMxK6soa5z31a2OC/aU7ri2V5x2qX6nTR2/XV9D08e2AxcEuYGMRcVrVB9j/3UKNpFFm2GsZKL1hxXmZfquQYOC2Hmzofu/kEJXga6zhcCWNkDqM9W3SA+MDRpzGu71Ct3ixc/9LHNd0g+BVWtUP1a3TpGdBaTWPbVBamubYNmtDPJ5EKGuquZio4yLzJ+bj25cixUoqu0tl0u17kKq8wrVWSMT/q0ssdhwakuJwqN0y516JrO1vf2baJx6fa+m2V/N3aHqgaQeFrIUautOoRRMWGGuGHIjvHLLi9jGF+4ZmbrymOaQyw7dF6O1H6bcJ2PB5x1G5aC34xxcbFrXFdRfWicdqmdJo0NXtWX//jfbX5P0dersEL7vcTQEQ/XUqvNyVPK0TopjrECme/kuOKZ2W4uNFKRta7IbZT9qut8EtN2dEDJZ9dSf3Wvddni4qxxY13jvaBJY63tUkeG+xY+emjzs6q+U2Er1IPdxn6idOyIgu91U4toNnQckF0KxxY34xeZXp9+Tet+10YqQZEu3A6IL9+o0HXuuMV9JZ+J86KtO91fGe52qcPX9D184FObKubVtqKqKUvb46LsS1etdtLLvtqioIY9qR3omODEqY+Cp0YqQVEm3OJi17lMC6052H65MDrs1y0uXm2ooivdXwtol1qc/lvpyWhtwe5RRSXBwdZWqBBtHe0xuVa7NzLf4z3dPCwM04Y4CHcNVranRipBUSrc4lXXeVZS9y0K7g9j7KgvKAENA0JsnDMeRTKVcqtb44hOrtX2huyFiLP2Gc/IdjcrwGmkomptvMBWXb8RiW0mt7oYcCEm6y7v1yXuACvbRsEWjos3NbihNS5LrtORsYmigmSxva7ORTrq6blW2zuyhXtG4QbQF/DsjLuS5mitWUx4m1sTIXHU1TfcK7QG5/10PmsH1j23x5HWv3K7nBttwi3Oi/diJrc67COLewmCHWinhTIvHTW/URGJaLughXdSgUWcx8LJtdpmIdvi6acaWh0WSiewWM532iCOjE0sYVHmaWZmoCsT3CsLYRJa4VWcwU/rOprDvyniGbywiVTuKm8FrvNeM76b6fNIPAsq2jqL6qOCRDuyuKzCVqh7NZV9ca22D7BwyG5x7LmGXzYe21vSs3gc/5aJHlO8Y7WwjVRcHSBzPYwfWgvLmFTWRLtwO7hmfLuzzum/p5F4FlSws/X19JrFrnGH6ShF24WqASQq4Vrt4MheOPs1DYq5CAixn/aWh9D8h4kQJHxF2eRLOLlWYRqpuETbq2FJ78lRJ3lXq6u8FWSFS3lpqS4bImJ89zMJkGgbsYiQ+KExiupyLVlwrXY4Sgrq6SmvYZYaVOj4BdATIEhPaqp6KMnofMWEoqSxp7ibKtaOUGGTAKLtpkTVGJFZ3DKpr6dnEBNNgmgXTBFtB4WtUGXDtdohgbtcRQOeQzLms/cClnaYTSa7zKMnintQQMZ4lKItnNkOsRZul1v8SFy7n/mkmBrcMCILtw1xiBdzrbYcVC2cd6hyR9OCSdayBEttCBnoTEQo3Dy240IjlbBeOri5ZSTdTsVSuOvr6eH6enrRtkYqPSDRNjYDGu5DXS9TELhWWxK416o8LOSOLstszuIqL5TVKVFHd0KmOzoMmDkZjVSwaXQaf8kwMIdiJ9zIFn/MwFo+lRgt2i5M9QZwrbZ8VN5rskgeI+s7jIBj+lMpYRv8RKBwZoKbybDhG3xeeuOvSJPT/GJ5I5VOxEW0my8T6l5N2lRxrbYCaCOEpESV5ZYHYYEvICGp1MtdCaHPoitbkjb3ScSxYlUxhPDNLKopSl5i3AilTMEzo2TDGCvhTuBggtiItospeERMgGu11TKjeOF02I8fWkSriBOWXWMeB1xdz9iyTggwFFR0b2ylH7kRlEApYOmfbukkOIwfLZvFuAn3WoJ20XEUbZWtUP1S5VpttWDhnNNcmjOEnyjXAU5wNAdV3Ru74Tx7UU2XrMYtxj2joHOTicRStF3kI27KQt8duKMR44t8TEoBZVHlOoufrwgAAARZSURBVG5zwDuetFDYfKyEGz25s+gPayvTMRdtp1wjynpXrtXWBBbOJGVZc+jFMLCRUjFm2ERokzwbu6xyEu/U4AYtFIdj2GqzF8Z0RJNAVK1Qp1m09YLrPZ2AX3WBrW1jSYo3ttn1MbYNWFKDG7Owvm24WSRw+ywSbccS010edpjLvqIB191mq6fG88PNBetN1kJjzs2ck9Ue685pGLKR7TFpzHSqmPJl3dhAzKfVFf8shp2Hy4QDZXe2ijcnOhqO5eJdcffyj32vcrjOnUljcZxSNW7IlC9V6LC6F7hW2wwsFW8Ov8QE3CfbxLvSWgptxZARcV7AS6jlNLntphvKHB9Hwp21wIWqMpxRYRemWVgm3twqN2ZYJt5tRxBbI9zivHivpQY3spjkYio1GzLHfaIqEzcJtdprBpyDbyDeJr+HXjBZtJNUgucbiPdwzHOg2oq2sE24HTBBa5+BD7cTz07UDl5RX+FE1GqjtE4WWr1RNFEppiEsOt9bZYt22JGQLeja0MkMEWjN43HFvOPo/VnqZpRYKdzivHgvwnVuSs33QgLi2d2QHetOUq22rGdY+/VC+VScQliOlaOq7EuWBailLA3CIeuco3j+TsP7E6cNJGWPd/UkWivc4uKa7+mIb9phOg/b49ndgLUhS4CSliwka5GOJOuevAa0EBnwHvZiTsOGUNY90FlPLsPzUIuyBh7fPWy49U0e2X3u7PFOWC3cDnBNR1Hz3RzCjppzRk6sO3G12pIS/IqS3e6+we8xbGDsm7wBN9KCqTr0gmsQNoSn+17OS9hwRb4GuqzvfQZ6gOidGPcaTulrNBrqT8kg6uvpWU1DEWj3nk+yld0OzKe9I+DHEzuiE6MCFwMOU6hiUTDmWcT4zRlUBOgcEOGGFu+85NhzT3AvTwT8eCT3cmRsIhtiEhzVII9LPqXQ4HfKRzywpohn0NdGLHHCLc6LdxauJhULRnOUpI0NVWQRULwTP1cb123W53NbMzkfYGRsYgC9zlXP9nZDi+W8bsF2E/AdiPReBjznjpnRpoCNlM4pY1W8x/NBr0sihVucF+8BuIBkjWarQbC55tMDI2MTk3h4e81PrqE/L/eIfnWRmfcocktxyryHFT6JH5lWUA0bdRLqkinXI473ElbqvMe557RBUh5+kAnWpSyeQZmz3St4/uZlbLwSK9wO9fU07bSOhDxMoTmxhd3ivsEu3nlZ3LvdJSwQxiy0JtHlulVdC0SsvT4QiXHExel/BzyInBO7XETJVNn0RMY43kvXObcaPlVskqQIVJRgIznu+hnAf3ezyqt47pyfRTyDUtewxAu3OC/efna+bugmTSa4xIthGIbRTCKyynsRcFhJEvqMMwzDMIbBFncL9fX0JKzvbu6QCjqgsQuXYRiG0QoLdxuQuFbqkCBTg2izpc0wDMNoh13lbUDHtU7DSmZZtBmGYZioYIu7B0hcK6E0gKztYXaRMwzDMJEghPh/6zDmGyilfysAAAAASUVORK5CYII=" alt="iViche_Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="134" title="iViche_Logo"></a></td>
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
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#BCBDBD;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#E06666;" href="${emailRedirectLink}/${code}">Підтвердити</a></p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:25px;padding-right:25px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#000;">Не працює? Скопіюйте посилання в Браузер</p>
                                                                                        </td>
                                                                                    </tr>
                                                                                    <tr style="border-collapse:collapse;">
                                                                                        <td align="left" style="Margin:0;padding-top:0px;padding-bottom:20px;padding-left:25px;padding-right:25px;">
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#000;"><a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#E06666;word-break:break-word;" href="${emailRedirectLink}/${code}">${emailRedirectLink}/${code}</a></p>
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
                                                                                        <td class="es-m-txt-c" align="center" style="padding:10px;padding-top:5px;Margin:0;font-size:0px; background:#fff;"><a><img src="data:image/png;base64,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" alt="iViche_Logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="108" title="iViche_Logo"></a></td>
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
<!--                                                                                            &nbsp; &nbsp; &nbsp;<a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#262626;" href>Підтримка</a></p>-->
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
                                                                                            <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;">Дякуємо за увагу! Ви отримали цього листа оскільки стали користувачем <a target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#FFFFFF;" href="${serverURL}">iviche.com</a></p>
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
