'use strict'

exports.isJSONFile = filename => /\.json$/ig.test(filename)

/**
 *
 * @param {object} data the data to evaluate
 * @param {object} query the MQL query
 * @returns
 */
exports.match = (data, query) => Object.keys(query).every(key => data[key] === query[key])
