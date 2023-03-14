import { TrxProvider } from '../../db/TrxProvider'
import { GenericDAO } from '../../generic/dao/GenericDAO'
import { ACS } from '../../security/acs/models/ACS'
import { AuthorData } from '../model/AuthorData'
import { Person } from '../model/Person'

export interface PersonDAO extends GenericDAO<Person> {
  updateByUsername(
    trxProvider: TrxProvider,
    username: string,
    person: Person,
    acs: ACS,
  ): Promise<void>

  updateEmail(trxProvider: TrxProvider, email: string, acs: ACS): Promise<void>

  updatePhone(trxProvider: TrxProvider, phone: string, acs: ACS): Promise<void>

  updateOwnAvatar(trxProvider: TrxProvider, avatar: string, acs: ACS): Promise<void>

  updateAvatarByUsername(
    trxProvider: TrxProvider,
    username: string,
    avatar: string,
    acs: ACS,
  ): Promise<void>

  updatePublicStatusByUserUID(trxProvider: TrxProvider, userUID: string): Promise<void>

  getByUserUID(trxProvider: TrxProvider, userUID: string): Promise<Person>

  getAuthorsByUserUIDs(trxProvider: TrxProvider, uids: Array<string>): Promise<Array<AuthorData>>

  getByEmail(trxProvider: TrxProvider, email: string): Promise<Person | undefined>
}
