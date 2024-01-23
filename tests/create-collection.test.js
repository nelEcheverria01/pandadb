'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { deleteFileSync } = require('./utils')

const db = new PandaDB('school.json')

test.after(_t => {
  deleteFileSync(db.path)
})

test(`collection(), will insert the collection synchronously into the
      database (JSON file) and return an object with methods to manipulate the collection data`, t => {
  const students = db.collection('students')

  t.assert(typeof students === 'object')
  t.assert(typeof students.create === 'function')
  t.assert(typeof students.createMany === 'function')
  t.assert(typeof students.destroy === 'function')
  t.assert(typeof students.edit === 'function')
  t.assert(typeof students.editMany === 'function')
  t.assert(typeof students.find === 'function')
  t.assert(typeof students.findMany === 'function')
  t.assert(typeof students.list === 'function')
  t.assert(typeof students.remove === 'function')
  t.assert(typeof students.removeMany === 'function')
})

test('when the collection name is not of type string, collection() should return an error', t => {
  const expectedMsg = 'the collection name must be of type string'

  t.throws(() => db.collection(100), { instanceOf: TypeError, message: expectedMsg })
  t.throws(() => db.collection(true), { instanceOf: TypeError, message: expectedMsg })
  t.throws(() => db.collection({}), { instanceOf: TypeError, message: expectedMsg })
  t.throws(() => db.collection([]), { instanceOf: TypeError, message: expectedMsg })
})

test('when an existing collection is created, the collection() method will throw an error', t => {
  const collection = 'sample'
  const expectedMsg = `the ${collection} collection already exists`

  db.collection('sample')
  t.throws(() => db.collection('sample'), { instanceOf: Error, message: expectedMsg })
})
