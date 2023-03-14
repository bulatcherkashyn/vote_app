import * as Knex from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table
      .boolean('notifyAboutNewPoll')
      .notNullable()
      .defaultTo(true)
      .alter()
  })

  await knex('user_details').update({ notifyAboutNewPoll: true })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_details', table => {
    table
      .boolean('notifyAboutNewPoll')
      .notNullable()
      .defaultTo(false)
      .alter()
  })

  await knex('user_details').update({ notifyAboutNewPoll: false })
}
