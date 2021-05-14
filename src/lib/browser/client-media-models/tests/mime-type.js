/* globals describe it */

const assert = require('assert')

const { mimeTypeManager } = require('../dist/node/main.js')

describe('Class “MimeTypeManager”', function () {
  it('Method “extensionToType()”', function () {
    assert.strictEqual(mimeTypeManager.extensionToType('jpg'), 'image')
  })
})
