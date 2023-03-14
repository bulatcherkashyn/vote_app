import * as Knex from 'knex'

import { Language } from '../../src/iviche/common/Language'
import { NewsSection } from '../../src/iviche/news/model/NewsSection'
import { NewsStatus } from '../../src/iviche/news/model/NewsStatus'
import { NewsTheme } from '../../src/iviche/news/model/NewsTheme'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('news', table => {
    table.uuid('uid').primary()
    table.string('alternativeLink', 1024).index()
    table.enum('section', Object.values(NewsSection)).defaultTo(NewsSection.COMMON)
    table.enum('theme', Object.values(NewsTheme)).defaultTo(NewsTheme.PUBLIC_INTEREST)
    table.enum('status', Object.values(NewsStatus)).defaultTo(NewsStatus.DRAFT)
    table.string('seoTitle', 1024)
    table.string('seoDescription', 1024)
    table.string('headerImage', 1024)
    table.dateTime('createdAt')
    table.dateTime('publishedAt')
    table.dateTime('lastSyncAt').index()
    table.integer('wpID').unique()
    table.json('tags')
    table.uuid('authorUID').references('users.uid')
    table.uuid('pollUID').references('poll.uid')
  })

  await knex.schema.createTable('news_body', table => {
    table.uuid('uid').primary()
    table.enum('language', Object.values(Language)).defaultTo(Language.UA)
    table.string('seoTitle', 1024)
    table.string('seoDescription', 1024)
    table.string('title', 1024)
    table.string('shortDescription', 1024)
    table.text('body')
    table.uuid('newsUID').references('news.uid')
    table.unique(['newsUID', 'language'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('news_body')
  await knex.schema.dropTable('news')
}
