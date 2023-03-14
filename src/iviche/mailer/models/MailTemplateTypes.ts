import { Language } from '../../common/Language'
import MailMessage from './MailMessage'

export type MailTemplates = {
  [templateCode: string]: {
    [lang in Language]: MailTemplateType
  }
}

export type MailTemplateType = (...args: Array<any>) => MailMessage
