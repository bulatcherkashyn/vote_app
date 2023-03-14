import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER TABLE "banner"
    DROP CONSTRAINT "banner_position_check",
    ADD CONSTRAINT "banner_position_check"
    CHECK ("position" IN ('after_news', 'after_polls', 'popup_center', 'popup_bottom'))
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER TABLE "banner"
    DROP CONSTRAINT "banner_position_check",
    ADD CONSTRAINT "banner_position_check"
    CHECK ("position" IN ('after_news', 'after_polls'))
  `)
}
