import * as Knex from 'knex'

import { Gender } from '../../src/iviche/common/Gender'
import { Region } from '../../src/iviche/common/Region'
import { SocialStatus } from '../../src/iviche/common/SocialStatus'
import { UserSystemStatus } from '../../src/iviche/users/models/UserSystemStatus'

export async function up(knex: Knex): Promise<void> {
  await knex('users')
    .update({ systemStatus: UserSystemStatus.SUSPENDED })
    .whereIn(
      'uid',
      knex('users')
        .select('users.uid')
        .innerJoin('person', 'person.uid', 'users.personUID')
        .where('users.systemStatus', UserSystemStatus.ACTIVE)
        .andWhere('person.gender', Gender.UNSET)
        .andWhere('person.socialStatus', SocialStatus.UNKNOWN)
        .andWhere('person.addressRegion', Region.UNKNOWN)
        .andWhere(function() {
          this.where('person.addressDistrict', '').orWhereNull('person.addressDistrict')
        })
        .andWhere(function() {
          this.where('person.addressTown', '').orWhereNull('person.addressTown')
        })
        .andWhere(function() {
          this.whereRaw(
            '"person"."birthdayAt" < (current_date - \'18 years\'::interval)::date',
          ).orWhereNull('person.birthdayAt')
        }),
    )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<void> {}
