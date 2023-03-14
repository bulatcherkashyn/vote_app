import joi from '@hapi/joi'

import { Language } from '../../common/Language'
import {
  adaptValidationResult,
  ValidationResult,
  Validator,
} from '../../common/validators/Validator'
import { UserDetails } from '../models/UserDetails'

export class UserDetailsValidator implements Validator<UserDetails> {
  public joiValidator = joi.object({
    notifyEmail: joi.boolean(),
    notifyAboutNewPoll: joi.boolean(),
    notifySMS: joi.boolean(),
    notifyTelegram: joi.boolean(),
    notifyViber: joi.boolean(),
    linkFacebook: joi.string(),
    linkGoogle: joi.string().empty(''),
    linkApple: joi.string(),
    linkSite: joi.string().empty(''),
    wpJournalistID: joi.number(),
    language: joi.string().valid(...Object.values(Language)),
  })

  validate(modelObject: UserDetails): ValidationResult {
    return adaptValidationResult(this.joiValidator.validate(modelObject))
  }
}
