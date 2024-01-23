'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.before(async _t => {
  await players.createMany([
    { name: 'Kobe Bryant', team: 'Leakers', shirtNumber: 24 },
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 }
  ])
})

test.after(_t => {
  deleteFileSync(db.path)
})

test('findMany, will find and return all the elements that match the query made', async t => {
  const result = await players.findMany({ team: 'Leakers' })
  const expected = [
    { name: 'Kobe Bryant', team: 'Leakers', shirtNumber: 24 },
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 }
  ]

  t.truthy(result[0].id)
  t.assert(typeof result[0].id === 'string')

  t.truthy(result[1].id)
  t.assert(typeof result[1].id === 'string')

  t.is(result[0].name, expected[0].name)
  t.is(result[0].team, expected[0].team)
  t.is(result[0].shirtNumber, expected[0].shirtNumber)

  t.is(result[1].name, expected[1].name)
  t.is(result[1].team, expected[1].team)
  t.is(result[1].shirtNumber, expected[1].shirtNumber)
})

test('findMany will return an error if the query is not compatible with MQL', async t => {
  await t.throwsAsync(async () => await players.findMany(4785))
  await t.throwsAsync(async () => await players.findMany(true))
  await t.throwsAsync(async () => await players.findMany('jj'))
  await t.throwsAsync(async () => await players.findMany([1, 2, 3]))
})
