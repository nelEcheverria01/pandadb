'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')

test.after(_t => {
  deleteFileSync(db.path)
})

test(`create(), should create the data passed by parameter in the JSON file in
      question and return a response object with information about the operation`,
async t => {
  const players = db.collection('players')
  const response = await players.create({ name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.createdItems, 1)
})
