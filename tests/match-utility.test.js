'use strict'

const test = require('ava')
const { match } = require('../lib/utils')

test('match(), returns a boolean when evaluating data that matches the query', t => {
  const data = { name: 'Michael Jordan', team: 'Chicago Bulls', shirtNumber: 23 }
  const query = { shirtNumber: 23 }

  t.true(match(data, query))
  t.false(match(data, { something: 'something' }))
})
