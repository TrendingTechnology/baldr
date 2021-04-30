const assert = require('assert')

const { ClientMediaAsset, mimeTypeManager } = require('../dist/node/main.js')

describe('Package “@bldr/client-media-models”', function () {
  it('Class ClientMediaAsset()', function () {
    const asset = new ClientMediaAsset('ref:test', 'http://localhost/dummy.jpg', { ref: 'ref:test', filename: 'test.jpg' })
    assert.strictEqual(asset.uri.raw, 'ref:test')
  })

  it('Class MimeTypeManager()', function () {
    assert.strictEqual(mimeTypeManager.extensionToType('jpg'), 'image')
  })
})
