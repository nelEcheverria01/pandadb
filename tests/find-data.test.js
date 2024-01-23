'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.before(async _t => {
  await players.createMany([
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 }
  ])
})

test.after(_t => {
  deleteFileSync(db.path)
})

test('find(), should return a promise with the element found based on the query', async t => {
  const result = await players.find({ name: 'Kyle Irving' })
  const expected = { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 }

  t.truthy(result.id)
  t.assert(typeof result.id === 'string')

  t.is(result.name, expected.name)
  t.is(result.team, expected.team)
  t.is(result.shirtNumber, expected.shirtNumber)
})

test('when the query provided does not comply with the MQL format an error should be thrown', async t => {
  await t.throwsAsync(async () => await players.find('robert'))
  await t.throwsAsync(async () => await players.find(45))
  await t.throwsAsync(async () => await players.find(false))
  await t.throwsAsync(async () => await players.find([]))
})
