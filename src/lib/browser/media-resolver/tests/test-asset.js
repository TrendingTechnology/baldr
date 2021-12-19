/* globals describe it */

const assert = require('assert')

const { createAsset } = require('./_helper')
const { resetMediaCache } = require('../dist/node/cache.js')

describe('Package “@bldr/media-resolver”: File “.ts”', function () {
  describe('Class “ClientMediaAsset” (mocked)', function () {
    it('multipart', function () {
      const asset = createAsset({ multiPartCount: 13 })
      assert.strictEqual(asset.getMultiPartHttpUrlByNo(1), 'http://localhost/dir/test.jpg')
      assert.strictEqual(asset.getMultiPartHttpUrlByNo(13), 'http://localhost/dir/test_no013.jpg')
      assert.throws(() => asset.getMultiPartHttpUrlByNo(14))
    })

    describe('property “shortcut”', function () {
      it('on an image', function () {
        resetMediaCache()
        const asset = createAsset()
        assert.strictEqual(asset.shortcut, 'i 1')
      })

      it('on an audio (over sample complete)', function () {
        resetMediaCache()
        const asset = createAsset({ mimeType: 'audio', path: 'dir/test.mp3' })
        assert.strictEqual(asset.shortcut, 'a 1')
      })

      it('manual set', function () {
        resetMediaCache()
        const asset = createAsset({ mimeType: 'audio', path: 'dir/test.mp3' })
        asset.shortcut = 'xxx'
        assert.strictEqual(asset.shortcut, 'xxx')
      })
    })
  })
})
