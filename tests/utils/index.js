'use strict'

const { statSync, unlinkSync } = require('node:fs')

exports.fileExistsSync = path => {
  try {
    const stats = statSync(path)
    return stats.isFile()
  } catch (_err) {
    return false
  }
}

exports.deleteFileSync = path => {
  unlinkSync(path)
}
