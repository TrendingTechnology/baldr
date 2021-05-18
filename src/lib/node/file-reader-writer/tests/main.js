/* globals describe it */

const { readFile, readJsonFile } = require('../dist/node/main.js')
const assert = require('assert')

describe('Package “@bldr/file-reader-writer”', function () {
  it('Function “readFile()”', function () {
    const content = readFile('/etc/baldr.json')
    assert.ok(content.indexOf('url') > -1)
  })

  it('Function “readJsonFile()”', function () {
    const content = readJsonFile('/etc/baldr.json')
    assert.strictEqual(content.api.port, '44523')
  })
})
