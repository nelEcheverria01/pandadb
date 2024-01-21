'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('school.json')

test.after(_t => {
  deleteFileSync(db.path)
})

test('collection(), will insert the collection into the database (JSON file) and return an object', t => {
  const students = db.collection('students')
  t.assert(typeof students === 'object')
})

test.todo('the returned object will contain methods to manipulate the collection data')
