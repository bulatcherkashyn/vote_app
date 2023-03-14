import * as Knex from 'knex'

import { BannerPositions } from '../../src/iviche/banner/model/BannerPositions'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('banner', table => {
    table.uuid('uid').primary()
    table.string('title', 255).notNullable()
    table.string('link', 255).notNullable()
    table.enum('position', Object.values(BannerPositions)).notNullable()
    table.string('urlImageBanner', 255).notNullable()
    table.boolean('showBanner').defaultTo(true)
    table.uuid('imageUid').notNullable()
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('banner')
}
