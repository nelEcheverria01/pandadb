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

test.todo('the object returned by the collection() method will contain methods to manipulate the collection data')

test('when the collection name is not of type string, collection() should return an error', t => {
  const expectedMsg = 'the collection name must be of type string'

  t.throws(() => db.collection(100), { message: expectedMsg })
  t.throws(() => db.collection(true), { message: expectedMsg })
  t.throws(() => db.collection({}), { message: expectedMsg })
  t.throws(() => db.collection([]), { message: expectedMsg })
})
