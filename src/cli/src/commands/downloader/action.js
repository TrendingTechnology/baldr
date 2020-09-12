
const lib = require('../../lib.js')
const { createYamlOneFile } = require('../yaml/action.js')

/**
 * @param {String} url
 * @param {String} id
 * @param {String} extension
 */
function action (url, id, extension) {
  const destFile = `${id}.${extension}`
  lib.fetchFile(url, `${id}.${extension}`)
  createYamlOneFile(destFile, { source: url })
}

module.exports = action
