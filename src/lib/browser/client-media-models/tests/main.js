const assert = require('assert')

const { ClientMediaAsset, mimeTypeManager } = require('../dist/node/main.js')

describe('Package “@bldr/client-media-models”', function () {
  it('Class ClientMediaAsset()', function () {
    const asset = new ClientMediaAsset({uri: 'id:test', filename: 'test.jpg'})
    assert.strictEqual(asset.uri.raw, 'id:test')
  })

  it('Class MimeTypeManager()', function () {
    assert.strictEqual(mimeTypeManager.extensionToType('jpg'), 'image')
  })
})
