import { QueryBuilder } from 'knex'

export const appendAuthorDataQuery = (query: QueryBuilder, tableName: string): void => {
  query
    .select(
      'authorPerson.isLegalPerson as authorIsLegalPerson',
      'authorPerson.firstName as authorFirstName',
      'authorPerson.lastName as authorLastName',
      'authorPerson.shortName as authorShortName',
      'authorPerson.avatar as authorAvatar',
      'authorPerson.email as authorEmail',
    )
    .innerJoin('users as authorUser', `${tableName}.authorUID`, 'authorUser.uid')
    .innerJoin('person as authorPerson', 'authorUser.personUID', 'authorPerson.uid')
}
