import { Request } from 'express'
import requestIp from 'request-ip'
import { UAParser } from 'ua-parser-js'

import { HeaderInfo } from '../../security/auth/models/HeaderInfo'

export class RequestHeaderInfo {
  headerInfo: HeaderInfo
  constructor(request: Request) {
    this.headerInfo = this.getHeaderInfo(request)
  }
  private getHeaderInfo(request: Request): HeaderInfo {
    return {
      ip: requestIp.getClientIp(request) as string,
      userAgent: new UAParser(request.headers['user-agent'] as string).getResult(),
    }
  }
}
