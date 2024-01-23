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

test(`editMany, should update the objects matching the query and return
      a response object with information about the action performed`, async t => {
  const response = await players.editMany({ team: 'Leakers' }, { championships: 60 })

  t.is(response.status, 'success')
  t.is(response.collection, 'players')
  t.is(response.updatedItems, 2)
})

test('editMany will return an error if the query provided does not comply with the MQL format', async t => {
  const expectedMsg = 'invalid MQL query'

  await t.throwsAsync(async () => await players.editMany('Leakers', { games: 986 }), { instanceOf: TypeError, message: expectedMsg })
})
