'use strict'

const { writeFileSync, existsSync, readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { readFile } = require('node:fs/promises')

const isJSONFile = filename => /\.json$/ig.test(filename)

class PandaDB {
  #data

  constructor (filename = 'pandadb.json') {
    this.filename = filename
    this.path = resolve(this.filename)

    if (!isJSONFile(this.filename)) throw new Error(`the ${this.filename} file must be of type JSON`)
    if (!existsSync(this.path)) writeFileSync(this.path, '{}')
  }

  collection (name) {
    const collection = name
    const _data = JSON.parse(readFileSync(this.path, 'utf8'))

    if (_data[collection]) throw new Error(`the ${collection} collection already exists`)

    _data[collection] = []
    writeFileSync(this.filename, JSON.stringify(_data, null, 2))

    return {} // TODO: here will be the methods to carry out a CRUD
  }

  async #loadData () {
    this.#data = JSON.parse(await readFile(this.filename, 'utf8'))
  }
}

module.exports = PandaDB
