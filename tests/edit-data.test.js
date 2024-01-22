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
