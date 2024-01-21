'use strict'

const { writeFileSync, existsSync, readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { readFile, writeFile } = require('node:fs/promises')
const { randomUUID } = require('node:crypto')

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

    return {
      list: async () => await this.#list(collection)
    }
  }

  async #loadData () {
    this.#data = JSON.parse(await readFile(this.filename, 'utf8'))
  }

  async #saveData () {
    await writeFile(this.filename, JSON.stringify(this.#data, null, 2))
  }

  async #list (collection) {
    await this.#loadData()
    return this.#data[collection]
  }

  async #create (collection, data) {
    await this.#loadData()
    this.#data[collection].push({ ...data, id: randomUUID() })
    await this.#saveData()

    return { status: 'success', collection, createdItems: 1 }
  }

  async #createMany (collection, arrData) {
    let createdItems = 0
    await this.#loadData()

    arrData.forEach((e, i, arr) => {
      arr[i] = { ...e, id: randomUUID() }
      createdItems++
    })
    this.#data[collection] = this.#data[collection].concat(arrData)

    await this.#saveData()
    return { status: 'success', collection, createdItems }
  }
}

module.exports = PandaDB
