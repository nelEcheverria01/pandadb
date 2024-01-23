'use strict'

const { writeFileSync, existsSync, readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { readFile, writeFile } = require('node:fs/promises')
const { randomUUID } = require('node:crypto')
const { isJSONFile, match } = require('./utils')

class PandaDB {
  #data

  constructor (filename = 'pandadb.json') {
    if (typeof filename !== 'string') {
      throw new TypeError('the filename parameter must be of type string')
    }

    this.filename = filename
    this.path = resolve(this.filename)

    if (!isJSONFile(this.filename)) {
      throw new TypeError(`${this.filename} file is not JSON file`)
    }
    if (!existsSync(this.path)) {
      writeFileSync(this.path, '{}')
    }
  }

  collection (name) {
    if (typeof name !== 'string') {
      throw new TypeError('the collection name must be of type string')
    }

    const collection = name
    const _data = JSON.parse(readFileSync(this.path, 'utf8'))

    if (_data[collection]) {
      throw new Error(`the ${collection} collection already exists`)
    }

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
    if (typeof data !== 'object' || Array.isArray(data)) {
      throw new TypeError('the data to be created must be of type string')
    }

    await this.#loadData()
    this.#data[collection].push({ ...data, id: randomUUID() })
    await this.#saveData()

    return { status: 'success', collection, createdItems: 1 }
  }

  async #createMany (collection, arrData) {
    if (!Array.isArray(arrData)) {
      throw new TypeError('the data argument must be an array')
    }

    arrData.forEach(data => {
      if (typeof data !== 'object' || Array.isArray(data)) {
        throw new TypeError('the elements of the provided array must be of type object')
      }
    })

    let createdItems = 0
    await this.#loadData()

    arrData.forEach((data, index, arr) => {
      arr[index] = { ...data, id: randomUUID() }
      createdItems++
    })
    this.#data[collection] = this.#data[collection].concat(arrData)

    await this.#saveData()
    return { status: 'success', collection, createdItems }
  }

  async #find (collection, query) {
    if (typeof query !== 'object' || Array.isArray(query)) {
      throw new TypeError('invalid MQL query')
    }

    await this.#loadData()
    return this.#data[collection].find(data => match(data, query)) || null
  }

  async #findMany (collection, query) {
    if (typeof query !== 'object' || Array.isArray(query)) {
      throw new TypeError('invalid MQL query')
    }

    await this.#loadData()
    const dataFound = this.#data[collection].filter(data => match(data, query))
    return dataFound.length === 0 ? null : dataFound
  }

  async #edit (collection, query, newData) {
    const dataFound = await this.#find(collection, query)

    if (!dataFound) {
      throw new Error(`no element found in collection ${collection} that matches the query`)
    }
    if (typeof newData !== 'object' || Array.isArray(newData)) {
      throw new TypeError('the data to be updated must be of object type')
    }

    const index = this.#data[collection].indexOf(dataFound)
    const updatedData = { ...dataFound, ...newData }

    this.#data[collection][index] = updatedData

    await this.#saveData()
    return { status: 'success', collection, updatedItems: 1 }
  }

  async #editMany (collection, query, newData) {
    if (typeof query !== 'object' || Array.isArray(query)) {
      throw new TypeError('invalid MQL query')
    }
    if (typeof newData !== 'object' || Array.isArray(query)) {
      throw new TypeError('the data to be updated must be of object type')
    }

    let updatedItems = 0
    await this.#loadData()

    this.#data[collection].filter(async (data, index, arr) => {
      if (match(data, query)) {
        this.#data[collection][index] = { ...data, ...newData }
        updatedItems++
        await this.#saveData()
      }
    })

    if (updatedItems === 0) {
      throw new Error(`no element found in collection ${collection} that matches the query`)
    }

    return { status: 'success', collection, updatedItems }
  }

  async #remove (collection, query) {
    const dataFound = await this.#find(collection, query)
    if (!dataFound) {
      throw new Error(`no element found in collection ${collection} that matches the query`)
    }

    const index = this.#data[collection].indexOf(dataFound)
    this.#data[collection].splice(index, 1)

    await this.#saveData()
    return { status: 'success', collection, removedItems: 1 }
  }

  async #removeMany (collection, query) {
    const dataToRemove = await this.#findMany(collection, query)

    if (!dataToRemove) {
      throw new Error(`no element found in collection ${collection} that matches the query`)
    }

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
