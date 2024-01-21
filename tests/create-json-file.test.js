'use strict'

const test = require('ava')
const PandaDB = require('../lib/pandadb')
const { statSync, unlinkSync } = require('node:fs')

function fileExistsSync (path) {
  try {
    const stats = statSync(path)
    return stats.isFile()
  } catch (_err) {
    return false
  }
}

function deleteFileSync (path) {
  unlinkSync(path)
}

const defaultFile = 'pandadb.json'
const customFile = 'this-is-my-custom-file.json'

test.after(_t => {
  deleteFileSync(defaultFile)
  deleteFileSync(customFile)
})

test('when PandaDB is instantiated, it should create a \'pandadb.json\' file by default synchronously', t => {
  const db = new PandaDB()
  t.true(fileExistsSync(db.filename))
})

test('by passing a custom filename to the constructor, PandaDB will create it synchronously', t => {
  const db = new PandaDB(customFile)
  t.true(fileExistsSync(db.filename))
})
