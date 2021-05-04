/* globals describe it */

const assert = require('assert')
const { createAsset } = require('./_helper')

const { mimeTypeManager } = require('../dist/node/mime-type.js')

describe('Package “@bldr/client-media-models”', function () {
  it('Class ClientMediaAsset()', function () {
    const asset = createAsset({ ref: 'test', filename: 'test.jpg' })
    assert.strictEqual(asset.uri.raw, 'ref:test')
  })

  it('Class MimeTypeManager()', function () {
    assert.strictEqual(mimeTypeManager.extensionToType('jpg'), 'image')
  })
})
