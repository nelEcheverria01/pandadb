'use strict'

const { writeFileSync, existsSync, readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { readFile, writeFile } = require('node:fs/promises')
const { randomUUID } = require('node:crypto')

// utils
const isJSONFile = filename => /\.json$/ig.test(filename)

class PandaDB {
  #data

  constructor (filename = 'pandadb.json') {
    /* eslint-disable-next-line */
    if (typeof filename !== 'string') throw new Error('the filename parameter must be of type string')

    this.filename = filename
    this.path = resolve(this.filename)

    if (!isJSONFile(this.filename)) throw new Error(`the ${this.filename} file must be of type JSON`)
    if (!existsSync(this.path)) writeFileSync(this.path, '{}')
  }

  collection (name) {
    if (typeof filename !== 'string') throw new Error('the collection name must be of type string')

    const collection = name
    const _data = JSON.parse(readFileSync(this.path, 'utf8'))

    if (_data[collection]) throw new Error(`the ${collection} collection already exists`)

    _data[collection] = []
    writeFileSync(this.filename, JSON.stringify(_data, null, 2))

    return {
      list: async () => await this.#list(collection),
      create: async data => await this.#create(collection, data),
      createMany: async arrData => await this.#createMany(collection, arrData),
      find: async query => await this.#find(collection, query),
      findMany: async query => await this.#findMany(collection, query),
      edit: async (query, newData) => await this.#edit(collection, query, newData),
      editMany: async (query, newData) => await this.#editMany(collection, query, newData),
      remove: async query => await this.#remove(collection, query),
      removeMany: async query => await this.#removeMany(collection, query),
      destroy: async () => await this.#destroy(collection)
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

  async #find (collection, query) {
    await this.#loadData()
    return this.#data[collection].find(data => Object.keys(query).every(key => data[key] === query[key])) || null
  }

  async #findMany (collection, query) {
    await this.#loadData()
    const dataFound = this.#data[collection].filter(data => Object.keys(query).every(key => data[key] === query[key]))
    return dataFound.length === 0 ? null : dataFound
  }

  async #edit (collection, query, newData) {
    const dataFound = await this.#find(collection, query)

    if (!dataFound) throw new Error(`no element found in collection '${collection}' that matches the query`)

    const index = this.#data[collection].indexOf(dataFound)
    const updatedData = { ...dataFound, ...newData }

    this.#data[collection][index] = updatedData

    await this.#saveData()
    return { status: 'success', collection, updatedItems: 1 }
  }

  async #editMany (collection, query, newData) {
    let updatedItems = 0
    await this.#loadData()

    this.#data[collection].filter(async (e, i, arr) => {
      if (Object.keys(query).every(key => e[key] === query[key])) {
        this.#data[collection][i] = { ...e, ...newData }
        updatedItems++
        await this.#saveData()
      }
    })

    if (updatedItems === 0) {
      throw new Error(`no element found in collection '${collection}' that matches the query`)
    }

    return { status: 'success', collection, updatedItems }
  }

  async #remove (collection, query) {
    const dataFound = await this.#find(collection, query)
    if (!dataFound) throw new Error(`no element found in collection '${collection}' that matches the query`)

    const index = this.#data[collection].indexOf(dataFound)
    this.#data[collection].splice(index, 1)

    await this.#saveData()
    return { status: 'success', collection, removedItems: 1 }
  }

  async #removeMany (collection, query) {
    const dataToRemove = await this.#findMany(collection, query)

    if (!dataToRemove) throw new Error(`no element found in collection '${collection}' that matches the query`)

    this.#data[collection] = this.#data[collection].filter(data => !dataToRemove.includes(data))

    await this.#saveData()
    return { status: 'success', collection, removedItems: dataToRemove.length }
  }

  async #destroy (collection) {
    await this.#loadData()
    delete this.#data[collection]
    await this.#saveData()

    return { status: 'success', destroyedCollection: collection }
  }
}

module.exports = PandaDB
