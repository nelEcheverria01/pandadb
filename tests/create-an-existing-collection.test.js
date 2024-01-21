'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB()

test.after(_t => {
  deleteFileSync(db.path)
})

test('when an existing collection is created, the collection() method will throw an error', t => {
  db.collection('sample')
  t.throws(() => db.collection('sample'))
})
