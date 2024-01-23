'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.after(_t => {
  deleteFileSync(db.path)
})

test(`create(), should create the data passed by parameter in the JSON file in
      question and return a response object with information about the operation`,
async t => {
  const response = await players.create({ name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.createdItems, 1)
})

test('when the data to be created is not of type object, the create() method returns an error', async t => {
  const expectedMsg = 'the data to be created must be of type string'

  await t.throwsAsync(async () => await players.create('data'), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.create(45), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.create(false), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.create([]), { instanceOf: TypeError, message: expectedMsg })
})
