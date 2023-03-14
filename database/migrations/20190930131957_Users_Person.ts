import 'reflect-metadata'

import * as Knex from 'knex'

import { Gender } from '../../src/iviche/common/Gender'
import { Region } from '../../src/iviche/common/Region'
import { SocialStatus } from '../../src/iviche/common/SocialStatus'
import { UserRole } from '../../src/iviche/common/UserRole'
import { UserSystemStatus } from '../../src/iviche/users/models/UserSystemStatus'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('person', table => {
    table.uuid('uid').primary()
    table
      .boolean('isLegalPerson')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('isPublicPerson')
      .notNullable()
      .defaultTo(false)
    table.string('firstName', 255)
    table.string('middleName', 255)
    table.string('lastName', 255)
    table.string('jobTitle', 255)
    table.string('legalName', 255)
    table.string('shortName', 128)
    table.string('tagline', 1024)
    table.string('email', 255).unique()
    table.string('phone', 24)
    table.dateTime('birthdayAt')
    table.enum('gender', Object.values(Gender)).defaultTo(Gender.UNSET)
    table.enum('socialStatus', Object.values(SocialStatus)).defaultTo(SocialStatus.UNKNOWN)
    table.string('bio', 16384)
    table.enum('addressRegion', Object.values(Region)).defaultTo(Region.UNKNOWN)
    table.string('addressDistrict', 64)
    table.string('addressTown', 64)

    /* unused for now */
    table.string('addressLine1', 255)
    /* unused for now */
    table.string('addressLine2', 255)
    /* unused for now */
    table.string('addressZip', 64)

    table.dateTime('createdAt')
    table.dateTime('deletedAt').nullable()
    table.uuid('avatar').nullable()
  })

  await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
    table.uuid('uid').primary()
    table
      .string('username', 128)
      .notNullable()
      .unique()
      .index('username')
    table.string('password', 128)
    table
      .enum('role', Object.values(UserRole))
      .notNullable()
      .defaultTo(UserRole.PRIVATE)
    table
      .enum('systemStatus', Object.values(UserSystemStatus))
      .defaultTo(UserSystemStatus.SUSPENDED)

    table.dateTime('createdAt')
    table.dateTime('deletedAt').nullable()
    table.dateTime('lastLoginAt')
    table.uuid('personUID')
    table.foreign('personUID').references('person.uid')
  })

  await knex.schema.createTable('user_details', table => {
    table.uuid('uid').primary()
    table.string('googleId')
    table.string('facebookId')
    table.integer('wpJournalistID')
    table
      .boolean('emailConfirmed')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('phoneConfirmed')
      .notNullable()
      .defaultTo(false)
    table.string('emailConfirmationCode', 512)
    table.integer('phoneConfirmationCode', 6)
    table.dateTime('emailConfirmationCodeCreatedAt')
    table.dateTime('phoneConfirmationCodeCreatedAt')
    table
      .boolean('notifyEmail')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('notifySMS')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('notifyTelegram')
      .notNullable()
      .defaultTo(false)
    table
      .boolean('notifyViber')
      .notNullable()
      .defaultTo(false)
    table.string('linkFacebook', 255)
    table.string('linkGoogle', 255)
    table.string('linkSite', 255)
    table.json('newsPreferences')
    table.string('passwordRestorationCode', 512)
    table.dateTime('createdAt')
    table.dateTime('deletedAt').nullable()
  })

  await knex.seed.run({ specific: '01_InitialData.ts' })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('person')
  await knex.schema.dropTable('user_details')
}
