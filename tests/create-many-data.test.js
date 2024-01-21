'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')

test.after(_t => {
  deleteFileSync(db.path)
})

test(`to create a lot of data, you have to call createMany(), which will
      save the data array passed by parameter to the database (JSON file)`, async t => {
  const players = db.collection('players')
  const response = await players.createMany([
    { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 },
    { name: 'Lebron James', team: 'Leakers', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 }
  ])

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.createdItems, 3)
})
