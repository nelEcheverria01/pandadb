'use strict'

const test = require('ava')
const { isJSONFile } = require('../lib/utils')

test('should return a boolean, when evaluating the provided file', t => {
  t.true(isJSONFile('pandadb.json'))
  t.false(isJSONFile('sample.txt'))
})
