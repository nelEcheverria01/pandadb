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

test(`when edit() is called, it should return a promise with a response
      object, with information about the operation performed`, async t => {
  const response = await players.edit({ name: 'Kobe Bryant' }, { nickName: 'THE BEST' })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.updatedItems, 1)
})

test('when edit() tries to edit an element that does not exist, it should return an error', async t => {
  const err = await t.throwsAsync(async () => await players.edit({ some_property: true }, { update: 'any update' }))

  t.is(err.message, 'no element found in collection players that matches the query')
  t.assert(err instanceof Error)
})

test('edit, should return an error, when the update is not an object', async t => {
  const query = { name: 'Kobe Bryant' }
  const expectedMsg = 'the data to be updated must be of object type'

  await t.throwsAsync(async () => await players.edit(query, 80), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.edit(query, []), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.edit(query, true), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.edit(query, 'something to update'), { instanceOf: TypeError, message: expectedMsg })
})
