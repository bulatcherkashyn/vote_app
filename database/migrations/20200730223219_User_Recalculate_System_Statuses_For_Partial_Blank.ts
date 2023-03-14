import * as Knex from 'knex'

import { Gender } from '../../src/iviche/common/Gender'
import { Region } from '../../src/iviche/common/Region'
import { SocialStatus } from '../../src/iviche/common/SocialStatus'
import { UserRole } from '../../src/iviche/common/UserRole'
import { UserSystemStatus } from '../../src/iviche/users/models/UserSystemStatus'

export async function up(knex: Knex): Promise<void> {
  await knex('users')
    .update({ systemStatus: UserSystemStatus.SUSPENDED })
    .whereIn(
      'uid',
      knex('users')
        .select('users.uid')
        .innerJoin('person', 'person.uid', 'users.personUID')
        .where('role', UserRole.PRIVATE)
        .andWhere('users.systemStatus', UserSystemStatus.ACTIVE)
        .andWhere(function() {
          this.orWhere('person.gender', Gender.UNSET)
            .orWhere('person.socialStatus', SocialStatus.UNKNOWN)
            .orWhere('person.addressRegion', Region.UNKNOWN)
            // NOTE use coalesce to check for null and empty
            .orWhere(function() {
              this.whereRaw(`coalesce("person"."addressDistrict", '') = ''`).andWhereRaw(
                `coalesce("person"."addressTown", '') = ''`,
              )
            })
            .orWhereRaw('"person"."birthdayAt" >= (current_date - \'18 years\'::interval)::date')
            .orWhereNull('person.birthdayAt')
        }),
    )
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<void> {}
