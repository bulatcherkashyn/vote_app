import { TrxProvider } from '../../db/TrxProvider'
import { Tag } from '../model/Tag'

export interface TagService {
  update(entity: Tag): Promise<void>
  save(entity: Tag): Promise<string | undefined>

  saveMultiple(trxProvider: TrxProvider, tagValues: Array<string>): Promise<Array<Tag>>

  delete(uid: string): Promise<void>

  list(): Promise<Array<Tag>>
}
