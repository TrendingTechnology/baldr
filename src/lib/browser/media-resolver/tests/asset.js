/* globals describe it */

const assert = require('assert')

const { createAsset, resolveSingleByUuid } = require('./_helper')
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

  describe('Class “ClientMediaAsset” (resolved)', function () {
    describe('audio with preview and waveform: ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island', async function () {
      const asset = await resolveSingleByUuid('edd86315-64c1-445c-bcd3-b0dab14af112')
      const httpUrlBase = 'http://localhost/media/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/'

      it('Property “ref”', async function () {
        assert.strictEqual(asset.ref, 'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island')
      })

      it('Property “uuid”', async function () {
        assert.strictEqual(asset.uuid, 'uuid:edd86315-64c1-445c-bcd3-b0dab14af112')
      })

      it('Getter property “previewHttpUrl”', async function () {
        assert.strictEqual(
          asset.previewHttpUrl,
          httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_preview.jpg'
        )
      })

      it('Getter property “waveformHttpUrl”', async function () {
        assert.strictEqual(
          asset.waveformHttpUrl,
          httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_waveform.png'
        )
      })
    })
  })

  describe('document: ref:Hip-Hop-Hoerquiz_QL_RAAbits', async function () {
    const asset = await resolveSingleByUuid('c8c0f0e3-744e-4a22-b16f-b98695159d32')
    it('Getter property “waveformHttpUrl”', async function () {
      assert.strictEqual(asset.waveformHttpUrl, undefined)
    })
  })
})
