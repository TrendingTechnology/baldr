/* globals describe it */

const assert = require('assert')

const { createAsset } = require('./_helper')

describe('Class “ClientMediaAsset”', function () {
  it('multipart', function () {
    const asset = createAsset({ multiPartCount: 13 })
    assert.strictEqual(asset.getMultiPartHttpUrlByNo(1), 'http://localhost/dir/test.jpg')
    assert.strictEqual(asset.getMultiPartHttpUrlByNo(13), 'http://localhost/dir/test_no013.jpg')
    assert.throws(() => asset.getMultiPartHttpUrlByNo(14))
  })
})
