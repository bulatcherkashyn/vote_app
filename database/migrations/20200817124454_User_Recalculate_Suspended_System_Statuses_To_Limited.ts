import * as Knex from 'knex'

import { UserSystemStatus } from '../../src/iviche/users/models/UserSystemStatus'

export async function up(knex: Knex): Promise<void> {
  await knex('users')
    .update({ systemStatus: UserSystemStatus.LIMITED })
    .whereIn(
      'uid',
      knex('users')
        .select('users.uid')
        .innerJoin('person', 'person.uid', 'users.personUID')
        .innerJoin('user_details', 'user_details.uid', 'users.uid')
        .where('users.systemStatus', UserSystemStatus.SUSPENDED)
        .whereNotNull('person.firstName')
        .whereNotNull('person.lastName')
        .andWhere('user_details.emailConfirmed', true),
    )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<void> {}
