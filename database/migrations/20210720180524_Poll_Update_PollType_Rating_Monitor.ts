import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER TABLE "poll"
    DROP CONSTRAINT "poll_pollType_check",
    ADD CONSTRAINT "poll_pollType_check"
    CHECK ("pollType" IN ('REGULAR', 'BLITZ', 'RATING_MONITOR'))
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
  ALTER TABLE "poll"
    DROP CONSTRAINT "poll_pollType_check",
    ADD CONSTRAINT "poll_pollType_check"
    CHECK ("pollType" IN ('REGULAR, BLITZ'))
  `)
}
