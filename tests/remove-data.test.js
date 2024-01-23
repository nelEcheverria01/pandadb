'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.before(async _t => {
  await players.create({ name: 'Kobe Bryant', team: 'Leakers', shirtNumber: 24 })
})

test.after(_t => {
  deleteFileSync(db.path)
})

test(`to remove data, you must call remove() and it will remove the first element that
      matches the query, and return a response object, with information about the operation performed`, async t => {
  const response = await players.remove({ name: 'Kobe Bryant' })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.removedItems, 1)
})

test('when the remove method does not find data matching the query, it will throw an error', async t => {
  const err = await t.throwsAsync(async () => await players.remove({ blablabla: 'blalblabla...' }))

  t.is(err.message, 'no element found in collection players that matches the query')
  t.assert(err instanceof Error)
})
