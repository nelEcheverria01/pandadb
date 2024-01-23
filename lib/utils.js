'use strict'

exports.isJSONFile = filename => /\.json$/ig.test(filename)

exports.match = (data, query) => Object.keys(query).every(key => data[key] === query[key])
