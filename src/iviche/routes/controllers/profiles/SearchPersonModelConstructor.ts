import { Request } from 'express'

import { ModelConstructor } from '../../../common/ModelConstructor'
import { SearchedPerson } from '../../../person/model/SearchedPerson'

export class SearchPersonModelConstructor
  implements ModelConstructor<SearchedPerson, SearchedPerson> {
  public constructPureObject(req: Request): SearchedPerson {
    const { uid, email } = req.query

    return {
      uid,
      email,
    }
  }

  public constructRawForm(req: Request): SearchedPerson {
    return this.constructPureObject(req)
  }
}
