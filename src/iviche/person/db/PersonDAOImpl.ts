import { List } from 'immutable'
import uuidv4 from 'uuid/v4'

import { Gender } from '../../common/Gender'
import { Region } from '../../common/Region'
import { SocialStatus } from '../../common/SocialStatus'
import { DateUtility } from '../../common/utils/DateUtility'
import { TrxProvider } from '../../db/TrxProvider'
import { checkDAOResult } from '../../generic/dao/ErrorsDAO'
import { EntityFilter } from '../../generic/model/EntityFilter'
import { PagedList } from '../../generic/model/PagedList'
import { PaginationMetadata } from '../../generic/model/PaginationMetadata'
import { PaginationUtility } from '../../generic/utils/PaginationUtility'
import { logger } from '../../logger/LoggerFactory'
import { ACS } from '../../security/acs/models/ACS'
import { AuthorData } from '../model/AuthorData'
import { Person } from '../model/Person'
import { PersonDAO } from './PersonDAO'

export class PersonDAOImpl implements PersonDAO {
  public async saveOrUpdate(trxProvider: TrxProvider, entity: Person, acs: ACS): Promise<string> {
    logger.debug('person.dao.save-or-update')
    if (entity.uid) {
      await this.update(trxProvider, entity, acs)
      return entity.uid
    } else {
      return this.create(trxProvider, entity)
    }
  }

  private async create(trxProvider: TrxProvider, person: Person): Promise<string> {
    logger.debug('person.dao.create.start')
    const uid = uuidv4()

    const trx = await trxProvider()
    await trx('person').insert({
      uid: uid,
      isLegalPerson: person.isLegalPerson,
      isPublicPerson: person.isPublicPerson,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      jobTitle: person.jobTitle,
      legalName: person.legalName,
      shortName: person.shortName,
      tagline: person.tagline,
      email: person.email,
      phone: person.phone,
      birthdayAt: person.birthdayAt,
      gender: person.gender,
      socialStatus: person.socialStatus,
      bio: person.bio,
      addressRegion: person.addressRegion,
      addressDistrict: person.addressDistrict,
      addressTown: person.addressTown,
      createdAt: DateUtility.now(),
    })
    logger.debug('person.dao.create.done')
    return uid
  }

  private async update(trxProvider: TrxProvider, person: Person, acs: ACS): Promise<void> {
    logger.debug('person.dao.update.start')
    const trx = await trxProvider()
    const queryBuilder = trx('person')
      .where({ uid: person.uid })
      .update({
        isLegalPerson: person.isLegalPerson,
        isPublicPerson: person.isPublicPerson,
        firstName: person.firstName,
        middleName: person.middleName,
        lastName: person.lastName,
        jobTitle: person.jobTitle,
        legalName: person.legalName,
        shortName: person.shortName,
        tagline: person.tagline,
        email: person.email,
        phone: person.phone,
        birthdayAt: person.birthdayAt,
        gender: person.gender,
        socialStatus: person.socialStatus,
        bio: person.bio,
        addressRegion: person.addressRegion,
        addressDistrict: person.addressDistrict,
        addressTown: person.addressTown,
      })
    if (!acs.fullAccess) {
      queryBuilder.whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
    }

    const result = await queryBuilder

    checkDAOResult(result, 'person', 'update')
    logger.debug('person.dao.update.done')
  }

  public static async getAuthorData(trxProvider: TrxProvider, uid: string): Promise<AuthorData> {
    logger.debug('person.dao.get-author-data.start')
    const trx = await trxProvider()

    const result = await trx<Person>('person')
      .where('users.uid', uid)
      .select('isLegalPerson', 'firstName', 'lastName', 'shortName', 'avatar', 'email')
      .innerJoin('users', 'users.personUID', 'person.uid')
      .first()

    logger.debug('person.dao.get-author-data.start.done')
    return result
  }

  public async get(trxProvider: TrxProvider, uid: string, acs: ACS): Promise<Person | undefined> {
    logger.debug('person.dao.get.start')
    const trx = await trxProvider()
    const queryBuilder = trx<Person | undefined>('person')
      .select('*')
      .where('uid', uid)
      .whereNull('deletedAt')

    if (!acs.fullAccess) {
      queryBuilder.whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
          .whereNull('deletedAt')
      })
    }

    logger.debug('person.dao.get.done')
    return queryBuilder.first()
  }

  public async delete(trxProvider: TrxProvider, uid: string): Promise<void> {
    logger.debug('person.dao.delete.start')
    const trx = await trxProvider()

    const result = await trx('person')
      .where({ uid: uid })
      .update({
        avatar: null,
        isLegalPerson: false,
        isPublicPerson: false,
        firstName: '',
        middleName: '',
        lastName: '',
        jobTitle: '',
        legalName: '',
        shortName: '',
        tagline: '',
        phone: '',
        birthdayAt: null,
        gender: Gender.UNSET,
        socialStatus: SocialStatus.UNEMPLOYED,
        bio: '',
        addressRegion: Region.UNKNOWN,
        addressDistrict: '',
        addressTown: '',
        deletedAt: DateUtility.now(),
      })

    checkDAOResult(result, 'person', 'delete')
    logger.debug('person.dao.delete.done')
  }

  public async list(
    trxProvider: TrxProvider,
    filter: EntityFilter,
    acs: ACS,
  ): Promise<PagedList<Person>> {
    logger.debug('person.dao.list.start')
    const trx = await trxProvider()

    const mainQuery = trx<Person>('person')
      .where(acs.toSQL('uid'))
      .whereNull('deletedAt')

    const pageMetadata: PaginationMetadata = await PaginationUtility.calculatePaginationMetadata(
      mainQuery,
      filter,
    )
    logger.debug('person.dao.list.counted')

    const persons = await PaginationUtility.applyPaginationForQuery(mainQuery, filter).select('*')

    logger.debug('person.dao.list.done')
    return {
      metadata: pageMetadata,
      list: List(persons),
    }
  }

  public async updateByUsername(
    trxProvider: TrxProvider,
    username: string,
    person: Person,
    acs: ACS,
  ): Promise<void> {
    logger.debug('person.dao.update-by-username.start')
    const trx = await trxProvider()
    const queryBuilder = trx('person')
      .whereIn(
        'uid',
        trx('users')
          .select('personUID')
          .where('username', username)
          .first(),
      )
      .update({
        isLegalPerson: person.isLegalPerson,
        isPublicPerson: person.isPublicPerson,
        firstName: person.firstName,
        middleName: person.middleName,
        lastName: person.lastName,
        phone: person.phone,
        jobTitle: person.jobTitle,
        legalName: person.legalName,
        shortName: person.shortName,
        tagline: person.tagline,
        birthdayAt: person.birthdayAt,
        gender: person.gender,
        socialStatus: person.socialStatus,
        bio: person.bio,
        addressRegion: person.addressRegion,
        addressDistrict: person.addressDistrict,
        addressTown: person.addressTown,
      })
    if (!acs.fullAccess) {
      queryBuilder.whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
    }

    const result = await queryBuilder
    checkDAOResult(result, 'person', 'update-by-username')
    logger.debug('person.dao.update-by-username.done')
  }

  public async updateEmail(trxProvider: TrxProvider, email: string, acs: ACS): Promise<void> {
    logger.debug('person.dao.update-email.start')
    const trx = await trxProvider()
    const result = await trx('person')
      .whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
      .update({ email })

    checkDAOResult(result, 'person', 'update-email')
    logger.debug('person.dao.update-email.done')
  }

  public async updatePhone(trxProvider: TrxProvider, phone: string, acs: ACS): Promise<void> {
    logger.debug('person.dao.update-phone.start')
    const trx = await trxProvider()
    const result = await trx('person')
      .whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
      .update({ phone })

    checkDAOResult(result, 'person', 'update-phone')
    logger.debug('person.dao.update-phone.done')
  }

  public async updateOwnAvatar(trxProvider: TrxProvider, avatar: string, acs: ACS): Promise<void> {
    logger.debug('person.dao.update-own-avatar.start')
    const trx = await trxProvider()
    const result = await trx('person')
      .whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
      .update({ avatar })

    checkDAOResult(result, 'person', 'update-own-avatar')
    logger.debug('person.dao.update-own-avatar.done')
  }

  public async updateAvatarByUsername(
    trxProvider: TrxProvider,
    username: string,
    avatar: string,
    acs: ACS,
  ): Promise<void> {
    logger.debug('person.dao.update-avatar-by-username.start')
    const trx = await trxProvider()
    const queryBuilder = trx('person')
      .whereIn(
        'uid',
        trx('users')
          .select('personUID')
          .where('username', username)
          .first(),
      )
      .update({
        avatar: avatar,
      })
    if (!acs.fullAccess) {
      queryBuilder.whereIn('uid', function() {
        return this.from('users')
          .select('personUID')
          .where(acs.toSQL('uid'))
      })
    }

    const result = await queryBuilder
    checkDAOResult(result, 'person', 'update-avatar-by-username')
    logger.debug('person.dao.update-avatar-by-username.done')
  }

  public async updatePublicStatusByUserUID(
    trxProvider: TrxProvider,
    userUID: string,
  ): Promise<void> {
    logger.debug('person.dao.update-public-status-by-user-uid.start')
    const trx = await trxProvider()
    const result = await trx<Person>('person')
      .whereIn(
        'uid',
        trx('users')
          .select('personUID')
          .where('uid', userUID)
          .first(),
      )
      .update({
        isPublicPerson: true,
      })

    checkDAOResult(result, 'person', 'update-public-status-by-user-uid')
    logger.debug('person.dao.get-by-user-uid.done')
  }
  public async getByUserUID(trxProvider: TrxProvider, userUID: string): Promise<Person> {
    logger.debug('person.dao.get-by-user-uid.start')
    const trx = await trxProvider()
    const person = await trx<Person>('users')
      .select('person.*')
      .where('users.uid', '=', userUID)
      .innerJoin('person', 'users.personUID', 'person.uid')
      .first()

    logger.debug('person.dao.get-by-user-uid.done')
    return person
  }

  public async getAuthorsByUserUIDs(
    trxProvider: TrxProvider,
    UIDs: Array<string>,
  ): Promise<Array<AuthorData>> {
    logger.debug('person.dao.get-authors-by-user-uids.start')

    const trx = await trxProvider()
    const authors = await trx<AuthorData>('users')
      .select(
        'users.uid as uid',
        'person.isLegalPerson as isLegalPerson',
        'person.firstName as firstName',
        'person.lastName as lastName',
        'person.shortName as shortName',
        'person.avatar as avatar',
      )
      .innerJoin('person', 'users.personUID', 'person.uid')
      .whereIn('users.uid', UIDs)

    logger.debug('person.dao.get-authors-by-user-uids.done')
    return authors
  }

  public async getByEmail(trxProvider: TrxProvider, email: string): Promise<Person | undefined> {
    logger.debug('person.dao.get-by-email.start')
    const trx = await trxProvider()
    const person = await trx<Person | undefined>('person')
      .select('*')
      .where('email', email)
      .whereNull('deletedAt')
      .first()

    logger.debug('person.dao.get-by-email.done')
    return person
  }
}
