'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.after(_t => {
  deleteFileSync(db.path)
})

test(`to create a lot of data, you have to call createMany(), which will
      save the data array passed by parameter to the database (JSON file)`, async t => {
  const response = await players.createMany([
    { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 },
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 }
  ])

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.createdItems, 3)
})

test('the createMany method should crash when the input is not an array of objects', async t => {
  const expectedMsg = 'the data argument must be an array'

  await t.throwsAsync(async () => await players.createMany({}), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.createMany(78545), { instanceOf: TypeError, message: expectedMsg })
  await t.throwsAsync(async () => await players.createMany(true), { instanceOf: TypeError, message: expectedMsg })

  // message expected when passing an array that does not contain objects
  const _expectedMsg = 'the elements of the provided array must be of type object'
  await t.throwsAsync(async () => await players.createMany([1, 2, 3]), { instanceOf: TypeError, message: _expectedMsg })
})
