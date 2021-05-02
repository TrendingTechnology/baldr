const assert = require('assert')

const { ClientMediaAsset } = require('../dist/node/asset.js')

describe('Class “ClientMediaAsset”', function () {
  it('multipart', function () {
    const asset = new ClientMediaAsset('ref:test', 'http://example.com/test.jpg', {
      ref: 'test',
      uuid: '75269599-0025-47e1-9698-a8744cdebee5',
      mimeType: 'image',
      title: 'Test',
      extension: 'jpg',
      filename: 'test.jpg',
      path: 'dir/test.jpg',
      previewImage: undefined,
      size: 1,
      timeModified: 12345,
      multiPartCount: 13
    })

    assert.strictEqual(asset.getMultiPartHttpUrlByNo(1), 'http://example.com/test.jpg')
    assert.strictEqual(asset.getMultiPartHttpUrlByNo(13), 'http://example.com/test_no013.jpg')
    assert.throws(() => asset.getMultiPartHttpUrlByNo(14))
  })
})
