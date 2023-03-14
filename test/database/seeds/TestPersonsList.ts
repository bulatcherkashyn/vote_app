import * as Knex from 'knex'

import { Gender } from '../../../src/iviche/common/Gender'
import { SocialStatus } from '../../../src/iviche/common/SocialStatus'
import { Person } from '../../../src/iviche/person/model/Person'

export const testPersonsList: Array<Person> = [
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000001',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Ivan',
    lastName: 'Ivanov',
    email: 'ivan.ivanov1@iviche.com',
    phone: '+380440001122#100',
    gender: Gender.MALE,
    socialStatus: SocialStatus.UNEMPLOYED,
  },
  {
    uid: '00000000-aaaa-aaaa-cccc-000000000002',
    isLegalPerson: false,
    isPublicPerson: true,
    firstName: 'Elena',
    lastName: 'Elenova',
    email: 'elena.elenova@iviche.com',
    phone: '+380440001122#200',
    gender: Gender.FEMALE,
    socialStatus: SocialStatus.UNEMPLOYED,
  },
]

export async function seed(knex: Knex): Promise<void> {
  await knex('person').insert(testPersonsList)
}
