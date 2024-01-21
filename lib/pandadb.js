'use strict'

const { writeFileSync, existsSync } = require('node:fs')

const isJSONFile = filename => /\.json$/ig.test(filename)

class PandaDB {
  constructor (filename = 'pandadb.json') {
    this.filename = filename
    if (!isJSONFile(this.filename)) throw new Error(`the ${this.filename} file must be of type JSON`)
    if (!existsSync(this.filename)) writeFileSync(this.filename, '{}')
  }
}

module.exports = PandaDB
