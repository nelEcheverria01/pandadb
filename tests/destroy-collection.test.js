'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('NBA.json')
const players = db.collection('players')

test.before(async _t => {
  await players.createMany([
    { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 },
    { name: 'Kyle Irving', team: 'Celtics', shirtNumber: 11 },
    { name: 'Kobe Bryant', team: 'Leakers', shirtNumber: 24 }
  ])
})

test.after(_t => {
  deleteFileSync(db.path)
})

test('when the destroy method is called, it will delete the collection from which it is called', async t => {
  const response = await players.destroy()

  t.is(response.status, 'success')
  t.is(response.destroyedCollection, 'players')

  /**
   * The collection no longer exists but the
   * object on which the collection was established
   * will still be accessible, but all its operations
   * will be ignored, (they will return undefined)
   */
  t.is(await players.list(), undefined)
})
