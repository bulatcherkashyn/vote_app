import { TrxProvider } from '../../db/TrxProvider'
import { Tag } from '../model/Tag'

export interface TagDAO {
  update(trxProvider: TrxProvider, entity: Tag): Promise<string | undefined>

  saveMultiple(trxProvider: TrxProvider, tagValues: Array<string>): Promise<Array<Tag>>

  delete(trxProvider: TrxProvider, uid: string): Promise<void>

  list(trxProvider: TrxProvider, limit?: number): Promise<Array<Tag>>
}
