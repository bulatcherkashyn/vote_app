import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE vote
    ALTER COLUMN "ageGroup" DROP NOT NULL,
    ALTER COLUMN gender DROP NOT NULL,
    ALTER COLUMN "socialStatus" DROP NOT NULL,
    ALTER COLUMN "addressRegion" DROP NOT NULL;
  `)
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export async function down(knex: Knex): Promise<void> {}
