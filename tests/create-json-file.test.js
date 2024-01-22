'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { fileExistsSync, deleteFileSync } = require('./utils')

const defaultFile = 'pandadb.json'
const customFile = 'this-is-my-custom-file.json'

test.after(_t => {
  deleteFileSync(defaultFile)
  deleteFileSync(customFile)
})

test('when PandaDB is instantiated, it should create a \'pandadb.json\' file by default synchronously', t => {
  const db = new PandaDB()
  t.true(fileExistsSync(db.path))
})

test('by passing a custom filename to the constructor, PandaDB will create it synchronously', t => {
  const db = new PandaDB(customFile)
  t.true(fileExistsSync(db.path))
})

test('when the parameter provided to the constructor is not of type string it should throw an error', t => {
  t.throws(() => new PandaDB(500))
})
