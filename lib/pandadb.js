'use strict'

const { writeFileSync, existsSync } = require('node:fs')
const { resolve } = require('node:path')

const isJSONFile = filename => /\.json$/ig.test(filename)

class PandaDB {
  constructor (filename = 'pandadb.json') {
    this.filename = filename
    this.path = resolve(this.filename)

    if (!isJSONFile(this.filename)) throw new Error(`the ${this.filename} file must be of type JSON`)
    if (!existsSync(this.path)) writeFileSync(this.path, '{}')
  }
}

module.exports = PandaDB
