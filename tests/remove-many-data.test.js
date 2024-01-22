'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.before(async _t => {
  await players.createMany([
    { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 },
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 },
    { name: 'Kobe Bryant', team: 'Leakers', shirtNumber: 24 }
  ])
})

test.after(_t => {
  deleteFileSync(db.path)
})

test(`remove Many, remove all elements from the collection in question that match
      the provided query, and will return a response object with information about
      the operation`,
async t => {
  const response = await players.removeMany({ team: 'Leakers' })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.removedItems, 2)
})
